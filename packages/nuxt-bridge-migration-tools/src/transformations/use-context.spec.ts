import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./use-context";

test("useContext", () => {
  const source = `export default defineComponent({
  setup() {
    const { $axios, $sentry } = useContext();
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    const { $axios, $sentry } = useNuxtApp();
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
