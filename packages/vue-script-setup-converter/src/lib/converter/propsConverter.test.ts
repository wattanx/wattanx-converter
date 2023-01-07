import { expect, test } from "vitest";
import {
  CallExpression,
  ScriptTarget,
  SyntaxKind,
  Project,
  Node,
} from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import optionsApi from "../../samples/composition-api.txt?raw";
import { getNodeByKind } from "../helper";
import { convertProps } from "./propsConverter";

test("defineProps", () => {
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

  const props = convertProps(callexpression as CallExpression);

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `const props = defineProps({
  msg: {
    type: String,
    required: true,
    default: "HelloWorld",
  },
  foo: {
    type: String,
  },
});
`;

  expect(formatedText).toBe(expected);
});
