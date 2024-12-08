import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { getVueImportSpecifiers } from "./get-vue-import-specifiers";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  return getVueImportSpecifiers(sourceFile);
};

const source = `import { ref, reactive, computed } from "vue";`;

test("get vue import specifiers", () => {
  const output = parseScript(source);

  const expected = ["ref", "reactive", "computed"];

  expect(output).toEqual(expected);
});
