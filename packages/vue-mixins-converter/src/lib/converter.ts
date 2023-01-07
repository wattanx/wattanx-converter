import { Project, ScriptTarget, SyntaxKind } from 'ts-morph';
import { getNodeByKind } from '@wattanx/converter-utils';
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
    SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    // optionsAPI
    return convertOptionsApi(sourceFile, fileName, useNuxt);
  }

  throw new Error('no convert target');
};
