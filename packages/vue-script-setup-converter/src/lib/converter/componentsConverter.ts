import type {
  CallExpression,
  ObjectLiteralElementLike,
  PropertyAssignment,
} from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";
import { getOptionsNode } from "../helpers/node";

export const convertComponents = (node: CallExpression) => {
  const componentsNode = getOptionsNode(node, "components");

  if (!componentsNode) {
    return "";
  }

  return convertToDefineAsyncComponent(componentsNode);
};

const convertToDefineAsyncComponent = (node: PropertyAssignment) => {
  const child = node.getInitializer();

  if (!child) {
    throw new Error("components is empty.");
  }

  if (!Node.isObjectLiteralExpression(child)) return "";

  const properties = child.getProperties();

  const filterdProperties = properties.filter(filterDynamicImport);

  if (filterdProperties.length === 0) return "";

  const value = filterdProperties
    .map((x) => {
      const propertyName = x.getName();
      const arrowFunc = x.getFirstChildByKind(SyntaxKind.ArrowFunction);
      return `const ${propertyName} = defineAsyncComponent(${arrowFunc!.getText()})`;
    })
    .join("\n");

  return value;
};

// dynamicImportのあるPropertyAssignmentのみを抽出
const filterDynamicImport = (
  property: Node
): property is PropertyAssignment => {
  return Node.isPropertyAssignment(property) && hasDynamicImport(property);
};

const hasDynamicImport = (node: ObjectLiteralElementLike) => {
  return node.getText().includes("() => import(");
};
