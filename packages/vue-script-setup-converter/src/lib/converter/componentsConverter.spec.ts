import { expect, test } from "vitest";
import type { CallExpression } from "ts-morph";
import { ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import { getNodeByKind } from "../helpers/node";
import { convertComponents } from "./componentsConverter";

const parseScript = (input: string, lang: "js" | "ts" = "js") => {
  const {
    descriptor: { script },
  } = parse(input);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const components = convertComponents(callexpression as CallExpression);

  return components;
};

test("should be converted to defineAsyncComponent", () => {
  const source = `<script>
  import { defineComponent } from 'vue';
  import HelloWorld from './HelloWorld.vue';

  export default defineComponent({
    components: {
      HelloWorld,
      MyComp: () => import('./MyComp.vue'),
      Foo: () =>
        import('./Foo.vue'),
    }
  })
  `;
  const output = parseScript(source);

  expect(output).toMatchInlineSnapshot(
    `
    "const MyComp = defineAsyncComponent(() => import('./MyComp.vue'))
    const Foo = defineAsyncComponent(() =>
            import('./Foo.vue'))"
  `
  );
});

test("should be output as is", () => {
  const source = `<script>
  import { defineComponent, defineAsyncComponent } from 'vue';
  import HelloWorld from './HelloWorld.vue';

  export default defineComponent({
    components: {
      HelloWorld,
      MyComp: defineAsyncComponent(() => import('./MyComp.vue')),
      Foo: defineAsyncComponent(() =>
        import('./Foo.vue')),
    }
  })
  `;
  const output = parseScript(source);

  expect(output).toMatchInlineSnapshot(`
    "const MyComp = defineAsyncComponent(() => import('./MyComp.vue'))
    const Foo = defineAsyncComponent(() =>
            import('./Foo.vue'))"
  `);
});
