import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { convertMutations } from "./mutations-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  return convertMutations(sourceFile.getStatements());
};

const source = `export const mutations = {
  increment(state) {
    console.log("increment")
    state.counter++
  }
}

export const actions = {
  increment({ commit }) {
    commit("increment")
  },
  async fetchCounter({ state }) {
    // make request
    const res = { data: 10 };
    state.counter = res.data;
    return res.data;
  }
}
`;

test("setup mutations converter", () => {
  const output = parseScript(source);

  const expected = [
    {
      statements: ['console.log("increment")', "counter.value++"],
      mutationName: "increment",
    },
  ];

  expect(output).toEqual(expected);
});
