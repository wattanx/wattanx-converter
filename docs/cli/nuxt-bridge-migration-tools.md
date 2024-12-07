---
title: Nuxt Bridge Migration Tools
---

# Nuxt Bridge Migration Tools

A tool to support migration to Nuxt Bridge.

## Upgrade Steps

- [TypeScript](https://nuxt.com/docs/bridge/typescript)
- [Migrate Legacy Composition API](#migrate-legacy-composition-api)
  - [docs](https://nuxt.com/docs/bridge/bridge-composition-api)
- [Plugins and Middleware](https://nuxt.com/docs/bridge/plugins-and-middleware)
- [Migrate New Composition API](#migrate-new-composition-api)
  - [docs](https://nuxt.com/docs/bridge/nuxt3-compatible-api)
- [Meta Tags](https://nuxt.com/docs/bridge/meta)
- [Runtime Config](https://nuxt.com/docs/bridge/runtime-config)
- [Nitro](https://nuxt.com/docs/bridge/nitro)
- [Vite](https://nuxt.com/docs/bridge/vite)

## Usage

### Migrate Legacy Composition API

convert from `@nuxtjs/composition-api` to the legacy Composition API of `@nuxt/bridge`.

```bash
npx @wattanx/nuxt-bridge-migration@latest capi-legacy <files...>
```

```diff
const {
- $fetch,
- $fetchState,
+ fetch,
+ fetchState,
} = useFetch(async () => {
  ...
});
```

[useRoute migration](/cli/nuxt-bridge-migration-tools#useroute-migration)

### Migrate New Composition API

Convert to nuxt 3 compatible composables in nuxt bridge.

```bash
npx @wattanx/nuxt-bridge-migration@latest capi-migration <files...>
```

Perform the following conversions.

- [@nuxtjs/composition-api import migration](/cli/nuxt-bridge-migration-tools#nuxtjscomposition-api-import-migration)
- [useStore migration](/cli/nuxt-bridge-migration-tools#usestore-migration)
- [useContext migration](/cli/nuxt-bridge-migration-tools#usecontext-migration)
- [useMeta migration](/cli/nuxt-bridge-migration-tools#usemeta-migration)

### `@nuxtjs/composition-api` import migration

Convert `@nuxtjs/composition-api` for bridge.

```bash
npx @wattanx/nuxt-bridge-migration@latest capi-import <files...>
```

Path to the target vue file, which can be set with the glob pattern. e.g.: `src/**/*.vue`

- `@nuxtjs/composition-api` -> `#imports`
- `useContext` -> `useNuxtApp`
- `useStore` -> `useNuxtApp`
- `useMeta` -> `useHead`
- `useAsync` -> `useLazyAsyncData`
- `useFetch` -> `useLazyFetch`

### `useStore` migration

Convert `useStore` to `useNuxtApp().$store`

```bash
npx @wattanx/nuxt-bridge-migration@latest use-store <files...>
```

```diff
- const store = useStore();
+ const { $store: store } = useNuxtApp();
```

### `useContext` migration

Convert `useContext()` to `useNuxtApp()`

```bash
npx @wattanx/nuxt-bridge-migration@latest use-context <files...>
```

```diff
- const { $axios, $sentry } = useContext();
+ const { $axios, $sentry } = useNuxtApp();
```

### `useMeta` migration

Convert `useMeta` to `useHead`.

```bash
npx @wattanx/nuxt-bridge-migration@latest use-meta <files...>
```

```diff
- useMeta({ title: "wattanx-converter" });
+ useHead({ title: "wattanx-converter" });
```

### `useRoute` migration.

Removes `value` from the return value of `useRoute`.

```bash
npx @wattanx/nuxt-bridge-migration@latest use-route <files...>
```

```diff
const route = useRoute();
- const path = route.value.path;
+ const path = route.path;
```

### `defineNuxtMiddleware` migration

Remove `defineNuxtMiddleware`.

```bash
npx @wattanx/nuxt-bridge-migration@latest define-nuxt-middleware <files...>
```

```diff
- import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
- export default defineNuxtMiddleware(({ store, redirect }) => {
-   if (!store.state.authenticated) {
-     return redirect('/login')
-   }
- });

+ import type { Middleware } from '@nuxt/types';
+ export default <Middleware> function({ store, redirect }) {
+   if (!store.state.authenticated) {
+     return redirect('/login')
+   }
+ };
```

### `defineNuxtPlugin` migration

Remove `defineNuxtPlugin`.

```bash
npx @wattanx/nuxt-bridge-migration@latest define-nuxt-plugin <files...>
```

```diff
- import { defineNuxtPlugin } from '@nuxtjs/composition-api';
- export default defineNuxtPlugin((ctx, inject) => {
-   inject('hello', (msg) => console.log('Hello World'));
- });

+ import type { Plugin } from '@nuxt/types';
+ export default <Plugin> function(ctx, inject) {
+   inject('hello', (msg) => console.log('Hello World'));
+ };
```

:::warning
New format for nuxt 3 is not supported.
https://nuxt.com/docs/bridge/overview#new-plugins-format-optional
:::
