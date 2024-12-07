import { SyntaxKind, Node, PropertyAssignment, CallExpression } from "ts-morph";

export const getNodeByKind = (
  node: Node,
  kind: SyntaxKind
): Node | undefined => {
  const find = (node: Node): Node | undefined => {
    return node.forEachChild((child) => {
      if (child.getKind() === kind) {
        return child;
      }
      return find(child);
    });
  };
  return find(node);
};

export const getOptionsNode = (
  node: CallExpression,
  type: "name" | "layout" | "middleware" | "props" | "emits" | "components"
) => {
  const expression = getNodeByKind(node, SyntaxKind.ObjectLiteralExpression);

  if (!expression) {
    throw new Error("props is not found.");
  }
  if (!Node.isObjectLiteralExpression(expression)) {
    throw new Error("props is not found.");
  }

  const properties = expression
    .getProperties()
    .filter((x) => x.getKind() === SyntaxKind.PropertyAssignment);

  const propsNode = properties.find((x) => {
    const identifier = (x as PropertyAssignment).getName();
    return identifier === type;
  });

  if (!propsNode) {
    return;
  }

  return propsNode as PropertyAssignment;
};
