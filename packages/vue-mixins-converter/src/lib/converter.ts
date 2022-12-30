import ts from 'typescript';
import { getNodeByKind } from './utils/getNodeByKind';
import { convertOptionsApi } from './converters/optionsApiConverter';
import { Project, ScriptTarget } from 'ts-morph';

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

  const project = new Project({
    compilerOptions: {
      skipAddingFilesFromTsConfig: true,
      target: ScriptTarget.Latest,
    },
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile('src.tsx', scriptContent);

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
