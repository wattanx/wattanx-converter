import { ScriptTarget, Project, ts } from "ts-morph";
import { genImport } from "knitwork";
import { convertSetupStore } from "./setup-store-converter";

export type ConverterOptions = {
  input: string;
  version?: "vue" | "nuxt";
  outputType?: "pinia" | "useState";
};

export function convertSrc({
  input,
  version = "nuxt",
  outputType = "pinia",
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
    version === "nuxt"
      ? convertSetupStore(sourceFile.getStatements(), {
          useState: outputType === "useState",
        })
      : null;

  if (store) {
    if (outputType === "useState") {
      statements.addStatements(genImport("#imports", ["useState"]));
    }
    if (store.imports && store.imports.length > 0) {
      statements.addStatements(genImport("vue", store.imports));
    }
    statements.addStatements(store.output);
  }

  statements.formatText({
    semicolons: ts.SemicolonPreference.Insert,
    indentSize: 2,
  });

  return statements.getFullText();
}
