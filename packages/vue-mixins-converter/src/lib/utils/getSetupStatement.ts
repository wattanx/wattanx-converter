import { ConvertedExpression } from '../types';
import { nonNull } from './nonNull';
import { replaceThisContext } from './replaceThisContext';

export const getSetupStatements = (setupProps: ConvertedExpression[]) => {
  // this.prop => prop.valueにする対象
  const refNameMap: Map<string, true> = new Map();
  setupProps.forEach(({ use, returnNames }) => {
    if (
      returnNames != null &&
      use != null &&
      /^(toRefs|ref|computed)$/.test(use)
    ) {
      returnNames.forEach((returnName) => {
        refNameMap.set(returnName, true);
      });
    }
  });

  const returnPropsStatement = `return {${setupProps
    .filter((prop) => prop.use !== 'toRefs') // ignore spread props
    .map(({ returnNames }) => returnNames)
    .filter(nonNull)
    .flat()
    .join(',')}}`;

  return [...setupProps, { expression: returnPropsStatement }]
    .map(({ expression }) => replaceThisContext(expression, refNameMap))
    .flat();
};
