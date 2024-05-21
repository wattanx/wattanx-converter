import type {
  ImportDeclaration,
  ObjectLiteralElementLike,
  PropertyAssignment,
} from "ts-morph";
import { Node } from "ts-morph";

export const hasNamedImportIdentifier = (
  importDeclaration: ImportDeclaration,
  identifier: string
): boolean => {
  return Boolean(
    importDeclaration.getNamedImports().find((namedImport) => {
      return namedImport.getName() === identifier;
    })
  );
};

export const filterDynamicImport = (
  property: Node
): property is PropertyAssignment => {
  return Node.isPropertyAssignment(property) && hasDynamicImport(property);
};

export const hasDynamicImport = (node: ObjectLiteralElementLike) => {
  return node.getText().includes("() => import(");
};
