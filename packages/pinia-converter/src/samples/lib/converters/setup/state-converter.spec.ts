import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { convertState } from "./state-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const state = convertState(sourceFile.getStatements());

  const defineStore = `export const useSampleStore = defineStore("sample", () => {
    ${state}
  });`;

  const formatedText = prettier.format(defineStore, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

const source = `eexport const state = () => ({
  counter: 0,
  name: "John",
  age: 20,
})
`;

test("options store converter", () => {
  const output = parseScript(source);

  const expected = `export const useSampleStore = defineStore("sample", () => {
  const counter = ref(0);
  const name = ref("John");
  const age = ref(20);
});
`;
  expect(output).toBe(expected);
});
