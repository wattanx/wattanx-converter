# nuxt-bridge-migration-tools

A tool to support migration to Nuxt Bridge.

## Usage

### Migrating from `@nuxtjs/composition-api`

```bash
npx @wattanx/nuxt-bridge-migration capi-migration <files...>
```

Perform the following conversions.

- [`@nuxtjs/composition-api` import migration](/packages/nuxt-bridge-migration-tools/README.md#nuxtjscomposition-api-import-migration)
- [`useStore` migration](/packages/nuxt-bridge-migration-tools/README.md#usestore-migration)
- [`useContext` migration](/packages/nuxt-bridge-migration-tools/README.md#usecontext-migration)
- [`useMeta` migration](/packages/nuxt-bridge-migration-tools/README.md#usemeta-migration)
- [`useRoute` migration](/packages/nuxt-bridge-migration-tools/README.md#useroute-migration)

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

### `useMeta` migration

Convert `useMeta` to `useHead`.

```bash
npx @wattanx/nuxt-bridge-migration use-meta <files...>
```

```diff
- useMeta({ title: "wattanx-converter" });
+ useHead({ title: "wattanx-converter" });
```

### `useRoute` migration.

Removes `value` from the return value of `useRoute`.

```bash
npx @wattanx/nuxt-bridge-migration use-route <files...>
```

```diff:bash
const route = useRoute();
- const path = route.value.path;
+ const path = route.path;
```

### `defineNuxtMiddleware` migration

Remove `defineNuxtMiddleware`.

```bash
npx @wattanx/nuxt-bridge-migration define-nuxt-middleware <files...>
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
npx @wattanx/nuxt-bridge-migration define-nuxt-plugin <files...>
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

> ?????? New format for nuxt 3 is not supported.
> https://nuxt.com/docs/bridge/overview#new-plugins-format-optional
