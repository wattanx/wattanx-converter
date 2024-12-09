import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { convertSetupStore } from "./setup-store-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const defineStore = convertSetupStore(sourceFile.getStatements()).output;

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
    console.log("increment")
    state.counter++
  }
}

export const actions = {
  increment({ commit }) {
    console.log("increment action")
    commit("increment")
  },
  async fetchCounter({ state }) {
    // make request
    const res = { data: 10 };
    state.counter = res.data;
    return res.data;
  }
}`;

test("setup store converter", () => {
  const output = parseScript(source);

  expect(output).toMatchInlineSnapshot(`
    "export const useSampleStore = defineStore("sample", () => {
      const counter = ref(0);
      const getCounter = computed(() => {
        return counter.value;
      });
      const increment = () => {
        console.log("increment action");
        console.log("increment");
        counter.value++;
      };

      const fetchCounter = async () => {
        // make request
        const res = { data: 10 };

        counter.value = res.data;

        return res.data;
      };

      return { counter, getCounter, increment, fetchCounter };
    });
    "
  `);
});
