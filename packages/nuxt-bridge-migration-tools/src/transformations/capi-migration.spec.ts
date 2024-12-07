import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./capi-migration";

test("capi migration", () => {
  const source = `import { computed, defineComponent, useStore, useContext, useMeta, useRoute } from '@nuxtjs/composition-api';
export default defineComponent({
  setup() {
    const { $axios, $sentry } = useContext();
    const store = useStore();
    const fooGetters = computed(() => store.getters['foo']);
    useMeta({
      title: "wattanx-converter",
    })
    const route = useRoute();
    const params = route.params;
  }
});
`;

  const expected = `import { computed, defineComponent, useNuxtApp, useHead, useRoute } from '#imports';
export default defineComponent({
  setup() {
    const {
      $store: store,
      $axios,
      $sentry,
    } = useNuxtApp();
    const fooGetters = computed(() => store.getters['foo']);
    useHead({
      title: "wattanx-converter",
    })
    const route = useRoute();
    const params = route.params;
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
