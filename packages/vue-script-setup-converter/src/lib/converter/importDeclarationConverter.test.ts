import { expect, describe, it } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { convertDefineComponentImport } from "./importDeclarationConverter";

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
  const convertedImportDeclarationText =
    convertDefineComponentImport(sourceFile);

  const formatedText = prettier.format(convertedImportDeclarationText, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

describe("convertDefineComponentImport", () => {
  describe("when defineComponent is imported", () => {
    const source = `<script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("returns import declaration text removed defineComponent", () => {
      const output = parseScript(source);
      const expected = 'import { ref } from "vue";\n';

      expect(output).toBe(expected);
    });
  });

  describe("when only defineComponent is imported", () => {
    const source = `<script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("returns blank", () => {
      const output = parseScript(source);
      const expected = "";

      expect(output).toBe(expected);
    });
  });

  describe("when defineNuxtComponent is imported", () => {
    const source = `<script>
  import { defineNuxtComponent, ref } from '#imports';
  
  export default defineNuxtComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("returns import declaration text removed defineNuxtComponent", () => {
      const output = parseScript(source);
      const expected = 'import { ref } from "#imports";\n';

      expect(output).toBe(expected);
    });
  });

  describe("when only defineNuxtComponent is imported", () => {
    const source = `<script>
  import { defineNuxtComponent } from '#imports';
  
  export default defineNuxtComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("returns blank", () => {
      const output = parseScript(source);
      const expected = "";

      expect(output).toBe(expected);
    });
  });
});
