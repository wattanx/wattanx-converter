import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./use-route";

test("useRoute", () => {
  const source = `export default defineComponent({
  setup() {
    const route = useRoute();

    const path = route.value.path;
    const query = route.value.query;
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    const route = useRoute();

    const path = route.path;
    const query = route.query;
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
