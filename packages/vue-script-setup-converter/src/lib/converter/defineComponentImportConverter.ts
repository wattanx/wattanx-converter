import type { SourceFile } from "ts-morph";
import {
  hasNamedImportIdentifier,
  removeNamedImportIdentifier,
} from "../helpers/module";

export const convertDefineComponentImport = (sourceFile: SourceFile) => {
  let importDeclarationText = "";

  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    if (hasNamedImportIdentifier(importDeclaration, "defineComponent")) {
      importDeclarationText = removeNamedImportIdentifier(
        importDeclaration,
        "defineComponent"
      ).getText();
    }
    if (hasNamedImportIdentifier(importDeclaration, "defineNuxtComponent")) {
      importDeclarationText = removeNamedImportIdentifier(
        importDeclaration,
        "defineNuxtComponent"
      ).getText();
    }
  });

  return importDeclarationText;
};
