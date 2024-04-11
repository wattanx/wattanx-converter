/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import {
  SourceFile,
  Node,
  Project,
  ScriptTarget,
  ts,
  QuoteKind,
} from 'ts-morph';
import { getExportStatement } from '../utils/getExportStatement';
import { optionsConverter } from './options/optionsConverter';
import { getImportStatement } from '../utils/getImportStatement';

export const convertOptionsApi = (
  sourceFile: SourceFile,
  version?: 'vue2' | 'vue3' | 'nuxt2' | 'nuxt3'
) => {
  const options = optionsConverter(sourceFile);
  if (!options) {
    throw new Error('invalid options');
  }

  const { setupProps, propNames, otherProps } = options;

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

  statements.addStatements(getImportStatement(setupProps, version));
  statements.addStatements(
    sourceFile
      .getStatements()
      .filter((state) => !Node.isExportAssignment(state))
      .map((x) => x.getFullText())
  );
  statements.addStatements(
    getExportStatement(setupProps, propNames, otherProps)
  );

  statements.formatText({
    semicolons: ts.SemicolonPreference.Insert,
  });

  return statements.getFullText();
};
