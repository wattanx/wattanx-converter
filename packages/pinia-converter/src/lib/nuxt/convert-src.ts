import { ScriptTarget, SyntaxKind, Project, Node, ts } from "ts-morph";
import type { CallExpression } from "ts-morph";
import { genImport } from "knitwork";
import { convertSetupStore } from "./setup-store-converter";

export type ConverterOptions = {
  input: string;
  version?: "vue" | "nuxt";
};

export function convertSrc({
  input,
  version = "nuxt",
}: ConverterOptions): string {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile("s.tsx", input);

  const statements = project.createSourceFile("new.tsx");

  const importStatements = sourceFile
    .getImportDeclarations()
    .map((importDeclaration) => {
      const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
      if (moduleSpecifier === "vue") return "";

      return importDeclaration.getText();
    });

  statements.addStatements(importStatements);

  const store =
    version === "nuxt" ? convertSetupStore(sourceFile.getStatements()) : null;

  if (store) {
    statements.addStatements(genImport("vue", store.imports));
    statements.addStatements(store.output);
  }

  statements.formatText({
    semicolons: ts.SemicolonPreference.Insert,
    indentSize: 2,
  });

  return statements.getFullText();
}
