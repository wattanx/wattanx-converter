import {
  SourceFile,
  Node,
  Project,
  ScriptTarget,
  StructureKind,
  ts,
  QuoteKind,
} from 'ts-morph';
import { getExportStatement } from '../utils/getExportStatement';
import { optionsConverter } from './options/optionsConverter';
import { getImportStatement } from '../utils/getImportStatement';

export const convertOptionsApi = (
  sourceFile: SourceFile,
  fileName: string,
  useNuxt?: boolean
) => {
  const options = optionsConverter(sourceFile);
  if (!options) {
    throw new Error('invalid options');
  }

  const { setupProps, propNames } = options;

  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
      skipAddingFilesFromTsConfig: true,
    },
    manipulationSettings: {
      quoteKind: QuoteKind.Double,
    },
    useInMemoryFileSystem: true,
  });

  const statements = project.createSourceFile('new.tsx');

  statements.addStatements(getImportStatement(setupProps, useNuxt));
  statements.addStatements(
    sourceFile
      .getStatements()
      .filter((state) => !Node.isExportAssignment(state))
      .map((x) => x.getFullText())
  );
  statements.addStatements(getExportStatement(setupProps, propNames, fileName));

  statements.formatText({
    semicolons: ts.SemicolonPreference.Insert,
  });

  return statements.getFullText();
};
