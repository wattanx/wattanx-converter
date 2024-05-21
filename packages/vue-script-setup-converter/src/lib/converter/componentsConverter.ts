import type { CallExpression, PropertyAssignment } from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";
import { getOptionsNode } from "../helpers/node";
import { filterDynamicImport } from "../helpers/module";

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

  const filteredProperties = properties.filter(filterDynamicImport);

  if (filteredProperties.length === 0) return "";

  const value = filteredProperties
    .map((x) => {
      const propertyName = x.getName();
      const initializer = x.getInitializer();

      if (!initializer) return "";

      if (initializer.getText().includes("defineAsyncComponent")) {
        return `const ${propertyName} = ${initializer.getText()}`;
      }

      const arrowFunc = x.getFirstChildByKind(SyntaxKind.ArrowFunction);
      return `const ${propertyName} = defineAsyncComponent(${arrowFunc!.getText()})`;
    })
    .join("\n");

  return value;
};
