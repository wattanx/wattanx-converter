import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { convertState } from "./state-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  return convertState(sourceFile.getStatements());
};

const source = `eexport const state = () => ({
  counter: 0,
  name: "John",
  age: 20,
})
`;

test("setup state converter", () => {
  const output = parseScript(source);

  const expected = [
    {
      use: "ref",
      statement: "const counter = ref(0);\n",
      returnName: "counter",
    },
    {
      use: "ref",
      statement: 'const name = ref("John");\n',
      returnName: "name",
    },
    {
      use: "ref",
      statement: "const age = ref(20);\n",
      returnName: "age",
    },
  ];

  expect(output).toEqual(expected);
});
