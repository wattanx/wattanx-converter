import { expect, describe, it } from "vitest";
import { ScriptTarget, Project, ImportDeclaration } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import { hasNamedImportIdentifier } from "./module";

const getSourceFile = (input: string, lang: "js" | "ts" = "js") => {
  const {
    descriptor: { script },
  } = parse(input);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  return project.createSourceFile("s.tsx", script?.content ?? "");
};

describe("helpers/module", () => {
  describe("hasNamedImportIdentifier", () => {
    describe("when importDeclaration includes target namedImport", () => {
      const source = `<script>import { defineComponent, ref } from 'vue';</script>`;

      it("returns true", () => {
        const sourceFile = getSourceFile(source);
        const importDeclaration = sourceFile.getImportDeclaration("vue");
        const result = hasNamedImportIdentifier(
          importDeclaration as ImportDeclaration,
          "defineComponent"
        );

        expect(result).toBe(true);
      });
    });

    describe("when importDeclaration does not include target namedImport", () => {
      const source = `<script>import { ref } from 'vue';</script>`;

      it("returns true", () => {
        const sourceFile = getSourceFile(source);
        const importDeclaration = sourceFile.getImportDeclaration("vue");
        const result = hasNamedImportIdentifier(
          importDeclaration as ImportDeclaration,
          "defineComponent"
        );

        expect(result).toBe(false);
      });
    });
  });
});
