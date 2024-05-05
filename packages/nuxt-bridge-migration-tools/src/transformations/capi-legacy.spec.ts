import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./capi-legacy";

test("capi migration", () => {
  const source = `import { defineComponent, useRoute, useFetch } from '@nuxtjs/composition-api';
export default defineComponent({
  setup() {
    const { $fetch, $fetchState } = useFetch(async () => {
      $fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    })

    const route = useRoute();
    const path = route.value.path;
  }
});
`;

  const expected = `import { defineComponent, useRoute, useFetch } from '@nuxtjs/composition-api';
export default defineComponent({
  setup() {
    const {
      fetch,
      fetchState,
    } = useFetch(async () => {
      $fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    })

    const route = useRoute();
    const path = route.path;
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
