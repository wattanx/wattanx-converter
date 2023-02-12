---
title: "Nuxt Bridge Migration Tools"
---

A tool to support migration to Nuxt Bridge.

## Usage

### Migrating from `@nuxtjs/composition-api`

```bash
npx @wattanx/nuxt-bridge-migration capi-migration <files...>
```

Perform the following conversions.

- [@nuxtjs/composition-api import migration](/cli/nuxt-bridge-migration-tools#nuxtjscomposition-api-import-migration)
- [useStore migration](/cli/nuxt-bridge-migration-tools#usestore-migration)
- [useContext migration](/cli/nuxt-bridge-migration-tools#usecontext-migration)

### `@nuxtjs/composition-api` import migration

Convert `@nuxtjs/composition-api` for bridge.

```bash
npx @wattanx/nuxt-bridge-migration capi-import <files...>
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
npx @wattanx/nuxt-bridge-migration use-store <files...>
```

```diff
- const store = useStore();
+ const { $store: store } = useNuxtApp();
```

### `useContext` migration

Convert `useContext()` to `useNuxtApp()`

```bash
npx @wattanx/nuxt-bridge-migration use-context <files...>
```

```diff
- const { $axios, $sentry } = useContext();
+ const { $axios, $sentry } = useNuxtApp();
```
