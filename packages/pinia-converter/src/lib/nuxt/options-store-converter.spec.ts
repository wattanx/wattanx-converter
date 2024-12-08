import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { convertOptionsStore } from "./options-store-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const store = convertOptionsStore(sourceFile.getStatements());

  const defineStore = `export const useSampleStore = defineStore("sample", ${store});`;

  const formatedText = prettier.format(defineStore, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

const source = `export const state = () => ({
  counter: 0
})

export const getters = {
  getCounter(state) {
    return state.counter
  }
}

export const mutations = {
  increment(state) {
    state.counter++
  }
}

export const actions = {
  async fetchCounter({ state }) {
    // make request
    const res = { data: 10 };
    state.counter = res.data;
    return res.data;
  }
}`;

test.skip("options store converter", () => {
  const output = parseScript(source);

  const expected = `export const useSampleStore = defineStore("sample", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    getCounter(state) {
      return this.counter;
    },
  },
  actions: {
    async fetchCounter() {
      // make request
      const res = { data: 10 };
      this.counter = res.data;
      return res.data;
    },
  },
});
`;
  expect(output).toBe(expected);
});
