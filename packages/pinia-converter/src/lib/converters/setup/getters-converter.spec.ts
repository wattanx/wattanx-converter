import { test, expect } from "vitest";
import { ScriptTarget, Project } from "ts-morph";
import { convertGetters } from "./getters-converter";

const parseScript = (input: string) => {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  return convertGetters(sourceFile.getStatements());
};

const source = `export const getters = {
  getCounter(state) {
    return state.counter
  },
  plusOne: (state) => {
    const plusOne = state.counter + 1;
    return plusOne;
  },
  // TODO: need to convert to 'counter.value'
  spread: ({ counter }) => {
    return counter;
  },
  computedFunc: (state) => (arg) => {
    return state.counter + arg;
  }
}`;

test("setup mutations converter", () => {
  const output = parseScript(source);

  expect(output).toMatchInlineSnapshot(`
    [
      {
        "returnName": "getCounter",
        "statement": "const getCounter = computed(() => {
        return counter.value
    });
    ",
        "use": "computed",
      },
      {
        "returnName": "plusOne",
        "statement": "const plusOne = computed(() => {
        const plusOne = counter.value + 1;
        return plusOne;
    });
    ",
        "use": "computed",
      },
      {
        "returnName": "spread",
        "statement": "const spread = computed(() => {
        return counter;
    });
    ",
        "use": "computed",
      },
      {
        "returnName": "computedFunc",
        "statement": "const computedFunc = computed(() =>  (arg) => {
        return counter.value + arg;
      });
    ",
        "use": "computed",
      },
    ]
  `);
});
