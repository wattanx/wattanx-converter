/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { ConvertedExpression } from '../types';
import { nonNull } from './nonNull';

export const getImportStatement = (
  setupProps: ConvertedExpression[],
  useNuxt?: boolean
) => {
  let usedFunctions = [
    'defineComponent',
    ...new Set(setupProps.map(({ use }) => use).filter(nonNull)),
  ];

  const moduleName = useNuxt ? 'nuxtjs' : 'vue';

  if (useNuxt) {
    usedFunctions = [...usedFunctions, 'useStore'];
  }

  const compositionApiImportStatements = `import { ${usedFunctions.join(
    ','
  )} } from '@${moduleName}/composition-api'`;

  const vuexImportStatements = `import { useStore } from 'vuex';`;

  return useNuxt
    ? compositionApiImportStatements
    : vuexImportStatements + '\n' + compositionApiImportStatements;
};
