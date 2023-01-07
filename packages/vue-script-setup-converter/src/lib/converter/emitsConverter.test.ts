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
import optionsApi from "../../samples/composition-api-ts.txt?raw";
import { getNodeByKind } from "../helper";
import { convertEmits } from "./emitsConverter";

test("defineProps", () => {
  const {
    descriptor: { script },
  } = parse(optionsApi);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const emits = convertEmits(callexpression as CallExpression);

  const formatedText = prettier.format(emits, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `const emit = defineEmits({ change: (value: number) => true });
`;

  expect(formatedText).toBe(expected);
});
