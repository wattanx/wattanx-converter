import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./use-store";

test("useStore", () => {
  const source = `export default defineComponent({
  setup() {
    const store = useStore();
    const fooGetters = computed(() => store.getters['foo']);
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    const {
      $store: store,
    } = useNuxtApp();
    const fooGetters = computed(() => store.getters['foo']);
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});

test("exists useNuxtApp", () => {
  const source = `export default defineComponent({
  setup() {
    const {
      $axios,
      $sentry,
    } = useNuxtApp();
    const store = useStore();
    const fooGetters = computed(() => store.getters['foo']);
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    const {
      $store: store,
      $axios,
      $sentry,
    } = useNuxtApp();
    const fooGetters = computed(() => store.getters['foo']);
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
