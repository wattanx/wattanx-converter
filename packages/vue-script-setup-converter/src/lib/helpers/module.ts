import type { ImportDeclaration } from "ts-morph";

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
