/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { getNodeByKind } from '@wattanx/converter-utils';
import { convertOptionsApi } from './converters/optionsApiConverter';
import { Project, ScriptTarget, SyntaxKind } from 'ts-morph';
import { parse } from '@vue/compiler-sfc';

export type ConverterOptions = {
  input: string;
  useNuxt?: boolean;
};

export const convertSrc = ({ input, useNuxt }: ConverterOptions): string => {
  const {
    descriptor: { script },
  } = parse(input);

  const project = new Project({
    compilerOptions: {
      skipAddingFilesFromTsConfig: true,
      target: ScriptTarget.Latest,
    },
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile('s.tsx', script?.content ?? '');

  const exportAssignNode = getNodeByKind(
    sourceFile,
    SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    // optionsAPI
    return convertOptionsApi(sourceFile, useNuxt);
  }

  throw new Error('no convert target');
};
