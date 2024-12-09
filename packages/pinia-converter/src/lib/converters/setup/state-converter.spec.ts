import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { convertState } from "./state-converter";

const parseScript = (input: string, useState?: boolean) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  return convertState(sourceFile.getStatements(), useState);
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

test("convert to useState", () => {
  const output = parseScript(source, true);

  const expected = [
    {
      returnName: "counter",
      statement: `const counter = useState("counter", () => 0);\n`,
    },
    {
      returnName: "name",
      statement: `const name = useState("name", () => "John");\n`,
    },
    {
      returnName: "age",
      statement: `const age = useState("age", () => 20);\n`,
    },
  ];

  expect(output).toEqual(expected);
});
