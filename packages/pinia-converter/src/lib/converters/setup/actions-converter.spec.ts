import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { convertActions } from "./actions-converter";
import { convertMutations } from "./mutations-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const mutations = convertMutations(sourceFile.getStatements());

  return convertActions(sourceFile.getStatements(), mutations);
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

test("setup actions converter", () => {
  const output = parseScript(source);

  const expected = [
    {
      statement: `const increment = () => {
        console.log("increment")
        counter.value++
  };\n`,
      returnName: "increment",
    },
    {
      returnName: "fetchCounter",
      statement: `const fetchCounter = async () => {

          // make request
          const res = { data: 10 };

          counter.value = res.data

          return res.data;
  };\n`,
    },
  ];

  expect(output).toEqual(expected);
});
