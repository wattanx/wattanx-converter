import { getNodeByKind } from "../helpers/node";
import { CallExpression, SyntaxKind, MethodDeclaration } from "ts-morph";
import { replaceEmit } from "./emitsConverter";

export const convertSetup = (node: CallExpression) => {
  const setupNode = getNodeByKind(
    node,
    SyntaxKind.MethodDeclaration
  ) as MethodDeclaration;

  if (!setupNode) {
    return "";
  }

  const contextName = setupNode.getParameters()[1]?.getName() ?? "";

  const blockNode = getNodeByKind(setupNode, SyntaxKind.Block);

  if (!blockNode) {
    return "";
  }

  return blockNode
    .forEachChildAsArray()
    .filter((x) => x.getKind() !== SyntaxKind.ReturnStatement)
    .map((x) => {
      if (!contextName) {
        return x.getFullText();
      }
      return replaceEmit(x.getFullText(), contextName);
    })
    .join("");
};
