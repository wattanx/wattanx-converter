import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { convertGetters } from "./getters-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const getters = convertGetters(sourceFile.getStatements());

  const defineStore = `export const useSampleStore = defineStore("sample", {
    getters: ${getters.getText()}
  });`;

  const formatedText = prettier.format(defineStore, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

const source = `export const getters = {
  getCounter(state) {
    return state.counter
  },
  plusOne(state) {
    const plusOne = state.counter + 1;
    return plusOne;
  }
}`;

test("options store converter", () => {
  const output = parseScript(source);

  const expected = `export const useSampleStore = defineStore("sample", {
  getters: {
    getCounter(state) {
      return this.counter;
    },
    plusOne(state) {
      const plusOne = this.counter + 1;
      return plusOne;
    },
  },
});
`;
  expect(output).toBe(expected);
});
