import { ConvertedExpression } from '@wattanx/vue-composition-converter';
import { nonNull } from '@wattanx/converter-utils';

export const getImportStatement = (
  setupProps: ConvertedExpression[],
  useNuxt?: boolean
) => {
  let usedFunctions = [
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
