import type { SourceFile } from "ts-morph";
import { genImport } from "knitwork";

export const convertImportDeclaration = (sourceFile: SourceFile) => {
  const importDeclarations = sourceFile.getImportDeclarations();

  const vueImportDeclarations = importDeclarations.filter(
    (importDeclaration) => {
      if (importDeclaration.isTypeOnly()) return false;

      return ["vue", "#imports"].includes(
        importDeclaration.getModuleSpecifierValue()
      );
    }
  );

  const newVueImportDeclarations = vueImportDeclarations.map(
    (importDeclaration) => {
      const namedImports = importDeclaration.getNamedImports();

      const filteredNamedImports = namedImports
        .map((namedImport) => namedImport.getText())
        .filter(
          (text) => !["defineComponent", "defineNuxtComponent"].includes(text)
        );
      if (filteredNamedImports.length === 0) return "";

      return genImport(
        importDeclaration.getModuleSpecifierValue(),
        filteredNamedImports
      );
    }
  );

  return newVueImportDeclarations.join("\n");
};
