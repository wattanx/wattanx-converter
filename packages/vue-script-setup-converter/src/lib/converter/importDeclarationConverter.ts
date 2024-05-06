import type { ImportDeclaration, SourceFile } from "ts-morph";
import { hasNamedImportIdentifier } from "../helpers/module";

export const convertImportDeclaration = (sourceFile: SourceFile) => {
  let importDeclarationText = "";

  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    if (hasNamedImportIdentifier(importDeclaration, "defineComponent")) {
      importDeclarationText = convertToImportDeclarationText(
        importDeclaration,
        "defineComponent"
      );
    }
    if (hasNamedImportIdentifier(importDeclaration, "defineNuxtComponent")) {
      importDeclarationText = convertToImportDeclarationText(
        importDeclaration,
        "defineNuxtComponent"
      );
    }
  });

  return importDeclarationText;
};

const convertToImportDeclarationText = (
  importDeclaration: ImportDeclaration,
  identifier: string
) => {
  const filteredNamedImports = importDeclaration
    .getNamedImports()
    .map((namedImport) => namedImport.getText())
    .filter((text) => text !== identifier);

  if (filteredNamedImports.length === 0) return "";

  return `import { ${filteredNamedImports.join(
    ", "
  )} } from '${importDeclaration.getModuleSpecifierValue()}';`;
};
