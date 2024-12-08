import { SourceFile } from "ts-morph";

export function getVueImportSpecifiers(sourceFile: SourceFile): string[] {
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

  return vueImportDeclarations.flatMap((importDeclaration) => {
    return importDeclaration
      .getNamedImports()
      .map((namedImport) => namedImport.getText());
  });
}
