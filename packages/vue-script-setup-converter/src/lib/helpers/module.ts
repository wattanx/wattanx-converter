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

export const removeNamedImportIdentifier = (
  importDeclaration: ImportDeclaration,
  identifier: string
): ImportDeclaration => {
  if (!hasNamedImportIdentifier(importDeclaration, identifier)) {
    return importDeclaration;
  }

  const sourceFile = importDeclaration.getSourceFile();
  const newImportDeclaration = sourceFile.addImportDeclaration({
    moduleSpecifier: importDeclaration.getModuleSpecifierValue(),
    namedImports: importDeclaration
      .getNamedImports()
      .map((namedImport) => namedImport.getText()),
  });

  newImportDeclaration.getNamedImports().forEach((namedImport) => {
    if (namedImport.getName() === identifier) {
      namedImport.remove();
    }
  });

  return newImportDeclaration;
};
