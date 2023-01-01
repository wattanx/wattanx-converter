/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { Node, ObjectLiteralElementLike } from 'ts-morph';
import { getPropsFromInitializer } from '../../utils/getPropsFromInitializer';
import { getMethodExpression as _getMethodExpression } from '../../utils/getMethodExpression';

export const methodsConverter = (node: ObjectLiteralElementLike) => {
  if (!Node.isPropertyAssignment(node)) {
    return [];
  }
  return getPropsFromInitializer(node)
    .map((prop) => _getMethodExpression(prop))
    .flat();
};
