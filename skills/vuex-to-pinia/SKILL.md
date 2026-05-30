---
name: vuex-to-pinia
description: Migrate Vue applications, Nuxt applications, and store-related tests from Vuex to Pinia. Use when Codex needs to replace Vuex stores, modules, mutations, actions, getters, map helpers, this.$store, useStore from vuex, commit/dispatch calls, Vuex plugins, or Nuxt Vuex store files with Pinia defineStore/useStore patterns, while preserving behavior and test coverage.
---

# Vuex to Pinia

## Overview

Use this skill to plan, implement, and verify Vuex to Pinia migrations. Prefer small behavior-preserving changes, and keep the migration aligned with the app's Vue, Nuxt, TypeScript, and test conventions.

For detailed conversion examples, read [migration-patterns.md](references/migration-patterns.md) when actively changing store or component code.

Use the official Pinia migration guide as the baseline source for migration semantics: https://pinia.vuejs.org/cookbook/migration-vuex.html

## Workflow

1. Inventory the current Vuex surface before editing:

   - Search for `vuex`, `createStore`, `new Vuex.Store`, `mapState`, `mapGetters`, `mapActions`, `mapMutations`, `mapStores`, `this.$store`, `useStore`, `commit(`, `dispatch(`, `registerModule`, and HMR store handling.
   - Identify Vue version, Nuxt version, TypeScript usage, store directory shape, root store state/getters/actions/mutations, namespaced or nested modules, Vuex plugins, persistence, SSR assumptions, router guards or other component-external store usage, and tests.
   - In this repository, inspect `packages/pinia-converter` first; reuse or extend existing converters and tests when the task is about this codebase.

2. Choose the Pinia store style:

   - Prefer setup stores for Composition API-heavy or TypeScript-first code.
   - Prefer option stores for a lower-risk mechanical migration from Vuex modules.
   - Use one `defineStore` per Vuex module. Flatten nested Vuex modules into separate Pinia stores that import each other.
   - Keep stable, descriptive store ids. Prefer camelCase ids when Options API `mapStores()` is used.
   - If Vuex root state/getters/actions/mutations contain real behavior, create a `root` Pinia store or keep Vuex temporarily during an incremental migration.

3. Install and register Pinia only if the target app does not already do so:

   - Add `pinia`.
   - Prefer a `stores/` directory for Pinia stores. Keep `store/` for remaining Vuex code during incremental migrations if both systems coexist.
   - Vue apps: create Pinia with `createPinia()` and `app.use(pinia)`.
   - Nuxt apps: use the project's Nuxt/Pinia module pattern. Confirm the local Nuxt version before changing config.

4. Convert stores before components:

   - Convert `state` to a function for option stores, or refs/reactive values for setup stores.
   - Remove getters that only return same-named state; Pinia exposes state directly.
   - Convert Vuex getters to Pinia getters or computed values. If a getter uses other getters through `this`, use a regular function and add an explicit return type in TypeScript.
   - Merge mutations into actions or direct assignments. Preserve validation and side effects from mutations.
   - Convert actions to Pinia actions. Replace Vuex `context` usage with direct state access and imports of other stores.
   - Replace cross-module `rootState`, `rootGetters`, `commit`, and `dispatch` with explicit calls to other Pinia stores. If the target module is still in Vuex during an incremental migration, access the remaining Vuex store directly and mark it as temporary.
   - Replace reset mutations with option-store `$reset()` when possible. Add a custom `$reset()` for setup stores.

5. Convert consumers:

   - Replace `this.$store.state.x`, `this.$store.getters[...]`, `commit`, and `dispatch` with calls to the relevant Pinia store.
   - Replace Vuex helper spreads with `storeToRefs()` for reactive state/getters and direct action destructuring for actions.
   - For Options API helpers, use Pinia helpers from `pinia` with the store definition, not string namespaces.
   - Avoid destructuring store state directly unless using `storeToRefs()`.
   - For router guards, API modules, and other code outside components, call `useXStore()` inside the function or request scope instead of at module top level.
   - Keep component names, public props, emitted events, and rendered behavior unchanged unless the user asked for a broader refactor.

6. Handle compatibility edges deliberately:

   - Dynamic Vuex modules usually become ordinary Pinia stores instantiated where needed; Pinia stores are dynamic by design.
   - Replace Vuex HMR code with Pinia's HMR pattern when the project had store hot reloading.
   - Vuex plugins need Pinia plugins or explicit subscriptions via `$subscribe`/`$onAction`.
   - SSR and tests must create a fresh Pinia instance per request/test.

7. Verify the migration:
   - Run the narrowest relevant tests first, then broader lint/build checks when the change touches shared store behavior.
   - Add or update tests for changed stores, cross-store actions, persistence plugins, and component consumers.
   - Search again for remaining Vuex imports/usages, dynamic module registration, and Vuex HMR code. Explain any intentional leftovers.

## Review Checklist

- No remaining Vuex runtime dependency unless intentionally kept during an incremental migration.
- Store state remains reactive after destructuring through `storeToRefs()`.
- Former mutations still enforce the same invariants.
- Async actions return the same values and propagate errors the same way.
- Namespaced Vuex modules map to clear Pinia store ids and imports.
- Component-external store usage calls `useXStore()` inside functions or per-request app setup.
- Incremental migration leftovers are explicit and temporary.
- HMR and plugin behavior are either migrated or intentionally removed.
- Tests create isolated Pinia instances and do not share store state.
- TypeScript types are preserved or improved without broad unrelated rewrites.
