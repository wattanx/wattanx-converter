import { getNodeByKind } from "./../helper";
import { CallExpression, SyntaxKind } from "ts-morph";
import { replaceEmit } from "./emitsConverter";

export const convertSetup = (node: CallExpression) => {
  const setupNode = getNodeByKind(node, SyntaxKind.MethodDeclaration);

  if (!setupNode) {
    throw new Error("setup is not found.");
  }

  const blockNode = getNodeByKind(setupNode, SyntaxKind.Block);

  if (!blockNode) {
    throw new Error("setup is not found.");
  }

  return blockNode
    .forEachChildAsArray()
    .filter((x) => x.getKind() !== SyntaxKind.ReturnStatement)
    .map((x) => replaceEmit(x.getFullText()))
    .join("");
};
