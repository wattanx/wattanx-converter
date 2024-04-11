/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { ConvertedExpression } from '../types';
import { nonNull } from '@wattanx/converter-utils';

export const getImportStatement = (
  setupProps: ConvertedExpression[],
  version?: 'vue2' | 'vue3' | 'nuxt2' | 'nuxt3'
) => {
  let usedFunctions = [
    'defineComponent',
    ...new Set(setupProps.map(({ use }) => use).filter(nonNull)),
  ];

  const getModuleName = (version?: 'vue2' | 'vue3' | 'nuxt2' | 'nuxt3') => {
    switch (version) {
      case 'vue2':
        return '@vue/composition-api';
      case 'vue3':
        return 'vue';
      case 'nuxt2':
        return '@nuxtjs/composition-api';
      case 'nuxt3':
        return '#imports';
      default:
        return 'vue';
    }
  };

  const vuexImportStatements = `import { useStore } from 'vuex';`;

  const compositionApiImportStatements = `import { ${usedFunctions.join(
    ','
  )} } from '${getModuleName(version)}'`;

  return vuexImportStatements + '\n' + compositionApiImportStatements;
};
