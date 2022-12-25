import ts from 'typescript';
import { getNodeByKind } from './helper';
import { convertOptionsApi } from './converters/optionsApiConverter';

export type ConverterOptions = {
  input: string;
  fileName: string;
  useNuxt?: boolean;
};

export const convertSrc = ({
  input,
  fileName,
  useNuxt,
}: ConverterOptions): string => {
  const scriptContent = input;

  const sourceFile = ts.createSourceFile(
    'src.tsx',
    scriptContent,
    ts.ScriptTarget.Latest
  );

  const exportAssignNode = getNodeByKind(
    sourceFile,
    ts.SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    // optionsAPI
    return convertOptionsApi(sourceFile, fileName, useNuxt);
  }

  throw new Error('no convert target');
};
