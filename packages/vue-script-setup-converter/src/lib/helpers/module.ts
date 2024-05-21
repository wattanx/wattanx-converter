import type {
  ImportDeclaration,
  ObjectLiteralElementLike,
  PropertyAssignment,
} from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";

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
  const arrowFunction = node.getFirstChildByKind(SyntaxKind.ArrowFunction);
  if (!arrowFunction) return false;
  return arrowFunction.getText().includes("() => import(");
};
