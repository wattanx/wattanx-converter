import { expect, describe, it } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import { convertImportDeclaration } from "./importDeclarationConverter";

const parseScript = (input: string) => {
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
  return convertImportDeclaration(sourceFile);
};

describe("convertImportDeclaration", () => {
  describe("when defineComponent is imported", () => {
    const source = `<script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("returns import declaration text removed defineComponent", () => {
      const output = parseScript(source);

      expect(output).toEqual([
        {
          importSpecifiers: ["ref"],
          moduleSpecifier: "vue",
        },
      ]);
    });
  });

  describe("when only defineComponent is imported", () => {
    const source = `<script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("importSpecifiers returns blank", () => {
      const output = parseScript(source);

      expect(output).toEqual([
        { importSpecifiers: [], moduleSpecifier: "vue" },
      ]);
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

      expect(output).toEqual([
        {
          importSpecifiers: ["ref"],
          moduleSpecifier: "#imports",
        },
      ]);
    });
  });

  describe("when only defineNuxtComponent is imported", () => {
    const source = `<script>
  import { defineNuxtComponent } from '#imports';
  
  export default defineNuxtComponent({
    name: 'HelloWorld',
  })
  </script>`;

    it("importSpecifiers returns blank", () => {
      const output = parseScript(source);

      expect(output).toEqual([
        {
          importSpecifiers: [],
          moduleSpecifier: "#imports",
        },
      ]);
    });
  });
});
