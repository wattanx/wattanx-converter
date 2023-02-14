import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./use-meta";

test("useMeta", () => {
  const source = `export default defineComponent({
  setup() {
    useMeta({
      title: "wattanx converter",
      titleTemplate: "%s - wattanx-converter",
      headAttrs: {},
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: ["dark-mode", "mobile"]
      },
      base: { target: "_blank", href: "/" },
      meta: [
        { charset: "utf-8" },
      ],
      link: [
        { rel: "stylesheet", href: "/css/index.css" },
      ],
      style: [
        { cssText: ".foo { color: red }", type: "text/css" }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js", async: true, defer: true }
      ],
      noscript: [
        { innerHTML: "This website requires JavaScript." }
      ],
    })
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    useHead({
      title: "wattanx converter",
      titleTemplate: "%s - wattanx-converter",

      htmlAttrs: {
        lang: "en",
      },

      bodyAttrs: {
        class: ["dark-mode", "mobile"]
      },

      base: { target: "_blank", href: "/" },

      meta: [
        { charset: "utf-8" },
      ],

      link: [
        { rel: "stylesheet", href: "/css/index.css" },
      ],

      style: [
        { cssText: ".foo { color: red }", type: "text/css" }
      ],

      script: [
        { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js", async: true, defer: true }
      ],

      noscript: [
        { innerHTML: "This website requires JavaScript." }
      ],
    })
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});

test("useMeta with reactive", () => {
  const source = `export default defineComponent({
  setup() {
    const title = ref('foo');

    useMeta(() => ({ title: title.value }));
  }
});
`;

  const expected = `export default defineComponent({
  setup() {
    const title = ref('foo');

    useHead({
      title: title.value,
    });
  }
});`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});
