# nuxt-bridge-migration-tools

A tool to support migration to Nuxt Bridge.

## Usage

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
