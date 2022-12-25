import ts from 'typescript';
import { getExportStatement, getImportStatement } from '../helper';
import { convertOptions } from './options/optionsConverter';

export const convertOptionsApi = (
  sourceFile: ts.SourceFile,
  fileName: string,
  useNuxt?: boolean
) => {
  const options = convertOptions(sourceFile);
  if (!options) {
    throw new Error('invalid options');
  }

  const { setupProps, propNames } = options;

  const newSrc = ts.factory.createSourceFile(
    [
      ...getImportStatement(setupProps,useNuxt),
      ...sourceFile.statements.filter((state) => !ts.isExportAssignment(state)),
      getExportStatement(setupProps, propNames, fileName),
    ],
    sourceFile.endOfFileToken,
    sourceFile.flags
  );
  const printer = ts.createPrinter();
  return printer.printFile(newSrc);
};
