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

// NOTE: This function makes a side effect
export const removeNamedImportIdentifier = (
  importDeclaration: ImportDeclaration,
  identifier: string
): void => {
  importDeclaration.getNamedImports().forEach((namedImport) => {
    if (namedImport.getName() === identifier) {
      namedImport.remove();
    }
  });
};
