import {
  CallExpression,
  ScriptTarget,
  SyntaxKind,
  Project,
  Node,
  ts,
} from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import { getNodeByKind } from "./helper";
import { hasNamedImportIdentifier } from "./helpers/module";
import { convertImportDeclaration } from "./converter/importDeclarationConverter";
import { convertPageMeta } from "./converter/pageMetaConverter";
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

  const importDeclaration = convertImportDeclaration(sourceFile) ?? "";
  const pageMeta = convertPageMeta(callexpression, lang) ?? "";
  const props = convertProps(callexpression, lang) ?? "";
  const emits = convertEmits(callexpression, lang) ?? "";
  const statement = convertSetup(callexpression) ?? "";

  const statements = project.createSourceFile("new.tsx");

  statements.addStatements(
    sourceFile
      .getStatements()
      .filter((state) => {
        if (Node.isExportAssignment(state)) return false;
        if (
          Node.isImportDeclaration(state) &&
          (hasNamedImportIdentifier(state, "defineComponent") ||
            hasNamedImportIdentifier(state, "defineNuxtComponent"))
        )
          return false;

        return true;
      })
      .map((x) => {
        return x.getText();
      })
  );

  statements.addStatements(importDeclaration);

  if (isDefineNuxtComponent(callexpression)) {
    statements.addStatements(pageMeta);
  }

  statements.addStatements(props);
  statements.addStatements(emits);
  statements.addStatements(statement);

  statements.formatText({
    semicolons: ts.SemicolonPreference.Insert,
    indentSize: 2,
  });

  return statements.getFullText();
};

const isDefineComponent = (node: CallExpression) => {
  if (!Node.isIdentifier(node.getExpression())) {
    return false;
  }

  return (
    node.getExpression().getText() === "defineComponent" ||
    node.getExpression().getText() === "defineNuxtComponent"
  );
};

const isDefineNuxtComponent = (node: CallExpression) => {
  if (!Node.isIdentifier(node.getExpression())) {
    return false;
  }
  return node.getExpression().getText() === "defineNuxtComponent";
};
