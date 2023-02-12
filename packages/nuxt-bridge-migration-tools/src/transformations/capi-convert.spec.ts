import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./capi-convert";

test("useStore", () => {
  const source = `import { computed, defineComponent, useStore } from '@nuxtjs/composition-api';
export default defineComponent({
  setup() {
    const store = useStore();
    const fooGetters = computed(() => store.getters['foo']);
  }
});
`;

  const expected = `import { computed, defineComponent, useNuxtApp } from '#imports';
export default defineComponent({
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
