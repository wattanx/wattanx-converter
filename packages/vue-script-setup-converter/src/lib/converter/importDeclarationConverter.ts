import type { SourceFile } from "ts-morph";

type ImportMap = {
  importSpecifiers: string[];
  moduleSpecifier: string;
};

export const convertImportDeclaration = (
  sourceFile: SourceFile
): ImportMap[] => {
  const importDeclarations = sourceFile.getImportDeclarations();

  const vueImportDeclarations = importDeclarations.filter(
    (importDeclaration) => {
      if (importDeclaration.isTypeOnly()) return false;

      return ["vue", "#imports"].includes(
        importDeclaration.getModuleSpecifierValue()
      );
    }
  );

  if (vueImportDeclarations.length === 0) return [];

  return vueImportDeclarations.map((importDeclaration) => {
    const namedImports = importDeclaration.getNamedImports();

    const filteredNamedImports = namedImports
      .map((namedImport) => namedImport.getText())
      .filter(
        (text) => !["defineComponent", "defineNuxtComponent"].includes(text)
      );

    return {
      importSpecifiers: filteredNamedImports,
      moduleSpecifier: importDeclaration.getModuleSpecifierValue(),
    };
  });
};
