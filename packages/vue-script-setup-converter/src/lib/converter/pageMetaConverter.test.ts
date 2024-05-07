import { expect, describe, it } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { getNodeByKind } from "../helpers/node";
import { convertPageMeta } from "./pageMetaConverter";

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

  const callExpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const pageMeta = convertPageMeta(callExpression as CallExpression, lang);

  const formatedText = prettier.format(pageMeta, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

describe("convertPageMeta", () => {
  describe("basic", () => {
    const source = `<script>
  import { defineNuxtComponent } from '#imports';
  
  export default defineNuxtComponent({
    name: 'HelloWorld',
    layout: 'test-layout',
    middleware: 'test-middleware',
  })
  </script>`;

    it("returns text including definePageMeta", () => {
      const output = parseScript(source);

      const expected = `definePageMeta({
  name: "HelloWorld",
  layout: "test-layout",
  middleware: "test-middleware",
});
`;

      expect(output).toBe(expected);
    });
  });

  describe("when middleware is array", () => {
    const source = `<script>
  import { defineNuxtComponent } from '#imports';
  
  export default defineNuxtComponent({
    name: 'HelloWorld',
    layout: 'test-layout',
    middleware: ['test-middleware-1', 'test-middleware-2'],
  })
  </script>`;

    it("returns text including definePageMeta", () => {
      const output = parseScript(source);

      const expected = `definePageMeta({
  name: "HelloWorld",
  layout: "test-layout",
  middleware: ["test-middleware-1", "test-middleware-2"],
});
`;

      expect(output).toBe(expected);
    });
  });
});
