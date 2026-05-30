# Vuex to Pinia Migration Patterns

Load this reference when converting Vuex store modules or component consumers.

## Store Module Mapping

Map each Vuex module to its own Pinia store. Nested Vuex modules can usually become flat files in `stores/`, with ids that preserve the old namespace meaning:

```txt
store/modules/nested/module-a.ts  ->  stores/nested-module-a.ts
namespace "nested/moduleA"        ->  defineStore("nestedModuleA", ...)
```

Use camelCase ids when `mapStores()` is used, because the generated helper names are easier to consume. If the old Vuex root `store/index.ts` contains state/getters/actions/mutations, migrate that behavior into a `root` store or keep Vuex temporarily while converting module by module.

Vuex option module:

```ts
export const user = {
  namespaced: true,
  state: () => ({
    name: "",
    loggedIn: false,
  }),
  getters: {
    name: (state) => state.name,
    displayName: (state) => state.name || "Guest",
    profileLabel(state, getters): string {
      return `${getters.displayName} profile`;
    },
  },
  mutations: {
    setName(state, name: string) {
      state.name = name;
    },
  },
  actions: {
    async login({ commit }, name: string) {
      commit("setName", name);
    },
  },
};
```

Pinia option store:

```ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    loggedIn: false,
  }),
  getters: {
    // Drop same-name pass-through getters; use `store.name` directly.
    displayName: (state) => state.name || "Guest",
    // Use a regular function when reading another getter through `this`.
    // In TypeScript, add an explicit return type.
    profileLabel(): string {
      return `${this.displayName} profile`;
    },
  },
  actions: {
    setName(name: string) {
      this.name = name;
    },
    async login(name: string) {
      this.setName(name);
    },
  },
});
```

Pinia setup store:

```ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const name = ref("");
  const loggedIn = ref(false);
  const displayName = computed(() => name.value || "Guest");

  function setName(value: string) {
    name.value = value;
  }

  async function login(value: string) {
    setName(value);
  }

  function $reset() {
    name.value = "";
    loggedIn.value = false;
  }

  return { name, loggedIn, displayName, setName, login, $reset };
});
```

## Vuex to Pinia Equivalents

| Vuex                                       | Pinia                                                    |
| ------------------------------------------ | -------------------------------------------------------- |
| `state.foo`                                | `store.foo`                                              |
| `getters.bar`                              | `store.bar`                                              |
| `commit("setFoo", value)`                  | `store.setFoo(value)` or `store.foo = value`             |
| `dispatch("save", payload)`                | `store.save(payload)`                                    |
| `dispatch("user/save", p, { root: true })` | `useUserStore().save(p)`                                 |
| `rootState.user.id`                        | `useUserStore().id`                                      |
| `rootGetters["user/name"]`                 | `useUserStore().name`                                    |
| `registerModule("x", module)`              | No direct equivalent; call `useXStore()` where needed    |
| reset mutation                             | option store `$reset()` or custom setup-store `$reset()` |
| `subscribe`                                | `store.$subscribe()`                                     |
| `subscribeAction`                          | `store.$onAction()`                                      |

## Component Consumers

Options API with Vuex helpers:

```ts
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState("user", ["name"]),
    ...mapGetters("user", ["displayName"]),
  },
  methods: {
    ...mapActions("user", ["login"]),
  },
};
```

Options API with Pinia:

```ts
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/stores/user";

export default {
  computed: {
    ...mapState(useUserStore, ["name", "displayName"]),
  },
  methods: {
    ...mapActions(useUserStore, ["login"]),
  },
};
```

Composition API:

```ts
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { name, displayName } = storeToRefs(userStore);
const { login } = userStore;
```

Use `storeToRefs()` for state and getters. Actions can be destructured directly because Pinia binds them to the store.

Composition API with direct Vuex `useStore()`:

```ts
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const firstName = computed(() => store.state.auth.user.firstName);
const fullName = computed(() => store.getters["auth/user/fullName"]);
```

Pinia equivalent:

```ts
import { computed } from "vue";
import { useAuthUserStore } from "@/stores/auth-user";

const authUserStore = useAuthUserStore();
const firstName = computed(() => authUserStore.firstName);
const fullName = computed(() => authUserStore.fullName);
```

Returning the whole store from `setup()` is acceptable when the template needs broad access.

## Usage Outside Components

Do not create a Pinia store instance at module top level for router guards, route middleware, API clients, or singleton utilities. Call `useXStore()` inside the function so the active Pinia instance is available, especially for SSR.

Vuex router guard:

```ts
import vuexStore from "@/store";

router.beforeEach((to, from, next) => {
  if (vuexStore.getters["auth/user/loggedIn"]) next();
  else next("/login");
});
```

Pinia router guard:

```ts
import { useAuthUserStore } from "@/stores/auth-user";

router.beforeEach((to, from, next) => {
  const authUserStore = useAuthUserStore();
  if (authUserStore.loggedIn) next();
  else next("/login");
});
```

## Main App Registration

Vue 3:

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

createApp(App).use(createPinia()).mount("#app");
```

Tests:

```ts
import { beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});
```

Component tests can use `createTestingPinia()` from `@pinia/testing` when action spying/stubbing is desired.

## Migration Pitfalls

- Do not destructure state/getters directly from a store without `storeToRefs()`, or reactivity can be lost.
- Do not convert every mutation to a trivial action if direct assignment is clearer and no invariant is involved.
- Do not keep pass-through getters such as `firstName: (state) => state.firstName`; Pinia state is directly readable.
- Do not leave TypeScript getters that use `this` without explicit return types.
- Preserve action return values; Vuex callers may await `dispatch`.
- Convert namespaced string paths to explicit store imports instead of recreating path parsing.
- Avoid a single global "root" Pinia store that mirrors the old Vuex tree unless root-level Vuex behavior or incremental compatibility requires it.
- Do not migrate dynamic module registration literally; Pinia stores are registered by being used.
- Replace Vuex HMR wiring with Pinia HMR wiring when the project relies on hot store updates.
- Check public Vuex plugins for Pinia alternatives before writing custom plugin ports.
- In SSR, create Pinia per request/app instance rather than sharing a singleton across users.
