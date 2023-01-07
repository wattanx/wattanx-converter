import { convertSetup } from "./setupConverter";
import { expect, test } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import optionsApi from "../../samples/composition-api.txt?raw";
import { getNodeByKind } from "../helper";

test("setup statements", () => {
  const {
    descriptor: { script, scriptSetup },
  } = parse(optionsApi);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const statement = convertSetup(callexpression as CallExpression);

  const formatedText = prettier.format(statement, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `const { msg, foo } = toRefs(props);
const newMsg = computed(() => msg.value + "- HelloWorld");

const count = ref(0);
`;

  expect(formatedText).toBe(expected);
});
