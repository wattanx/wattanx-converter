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

test("options store converter", () => {
  const output = parseScript(source);

  const expected = [
    {
      use: "ref",
      expression: "const counter = ref(0)",
      returnName: "counter",
    },
    {
      use: "ref",
      expression: 'const name = ref("John")',
      returnName: "name",
    },
    {
      use: "ref",
      expression: "const age = ref(20)",
      returnName: "age",
    },
  ];

  expect(output).toEqual(expected);
});
