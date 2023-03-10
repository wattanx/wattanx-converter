import {
  ConvertedExpression,
  getSetupStatements,
} from '@wattanx/vue-composition-converter';

export const getExportStatement = (
  setupProps: ConvertedExpression[],
  propNames: string[],
  fileName: string
) => {
  const variableStatements = getSetupStatements(setupProps);

  const parameters = propNames.length > 0 ? 'props, ctx' : 'ctx';

  const arrowFunction = `export const ${fileName} = (${parameters}) => {
    const store = useStore();
    ${variableStatements.join('\n')}
  }`;

  return arrowFunction;
};
