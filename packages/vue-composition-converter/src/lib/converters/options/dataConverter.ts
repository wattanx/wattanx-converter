/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { ObjectLiteralElementLike, SyntaxKind, Node } from 'ts-morph';
import { ConvertedExpression } from '../../types';
import { getNodeByKind } from '../../utils/getNodeByKind';

export const dataConverter = (
  node: ObjectLiteralElementLike
): ConvertedExpression[] => {
  const objNode = getNodeByKind(node, SyntaxKind.ObjectLiteralExpression);

  if (!(objNode && Node.isObjectLiteralExpression(objNode))) {
    return [];
  }

  return objNode
    .getProperties()
    .map((prop) => {
      if (!Node.isPropertyAssignment(prop)) {
        return;
      }
      const name = prop.getName();
      const text = prop.getInitializer()?.getText();
      return {
        use: 'ref',
        expression: `const ${name} = ref(${text})`,
        returnNames: [name],
      };
    })
    .filter(Boolean) as ConvertedExpression[];
};
