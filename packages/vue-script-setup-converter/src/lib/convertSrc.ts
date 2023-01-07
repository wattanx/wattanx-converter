import {
  CallExpression,
  ScriptTarget,
  SyntaxKind,
  Project,
  Node,
  ImportDeclaration,
} from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { getNodeByKind } from "./helper";
import { convertProps } from "./converter/propsConverter";
import { convertSetup } from "./converter/setupConverter";
import { convertEmits } from "./converter/emitsConverter";

export const convertSrc = (input: string) => {
  const {
    descriptor: { script },
  } = parse(input);

  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");
  const lang = script?.lang ?? "js";

  const importDeclaration = getNodeByKind(
    sourceFile,
    SyntaxKind.ImportDeclaration
  ) as ImportDeclaration;

  const importStatement = importDeclaration.getText() ?? "";

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  if (!callexpression) {
    throw new Error("defineComponent is not found.");
  }
  if (!Node.isCallExpression(callexpression)) {
    throw new Error("defineComponent is not found.");
  }

  if (!isDefineComponent(callexpression)) {
    throw new Error("defineComponent is not found.");
  }

  const props = convertProps(callexpression, lang) ?? "";
  const emits = convertEmits(callexpression, lang) ?? "";
  const statement = convertSetup(callexpression) ?? "";

  const formatedText = prettier.format(
    importStatement + props + emits + statement,
    {
      parser: "typescript",
      plugins: [parserTypeScript],
    }
  );

  return formatedText;
};

const isDefineComponent = (node: CallExpression) => {
  if (!Node.isIdentifier(node.getExpression())) {
    return false;
  }

  return node.getExpression().getText() === "defineComponent";
};
