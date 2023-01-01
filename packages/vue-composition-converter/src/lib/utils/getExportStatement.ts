/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { ObjectLiteralElementLike } from 'ts-morph';
import { ConvertedExpression } from '../types';
import { getSetupStatements } from './getSetupStatement';

export const getExportStatement = (
  setupProps: ConvertedExpression[],
  propNames: string[],
  otherProps: ObjectLiteralElementLike[]
) => {
  const variableStatements = getSetupStatements(setupProps);

  const parameters = propNames.length > 0 ? 'props, ctx' : 'ctx';

  const otherPropsNode = otherProps.map((x) => x.getText()).join(',\n');

  const arrowFunction = `export default defineComponent({
    ${otherPropsNode},
    setup(${parameters}) {
      const store = useStore();
      ${variableStatements.join('\n')}
    }
  })`;

  return arrowFunction;
};
