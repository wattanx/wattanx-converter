import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  rollup: {
    inlineDependencies: [
      "@wattanx/vue-script-setup-converter",
      "@wattanx/vue-composition-converter",
      "@wattanx/converter-utils",
    ],
  },
});
