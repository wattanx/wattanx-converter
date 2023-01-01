/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { PropertyAssignment, ObjectLiteralElementLike, Node } from 'ts-morph';

/** returns initializer.getProperties() */
export const getPropsFromInitializer = (
  node: PropertyAssignment
): ObjectLiteralElementLike[] => {
  const initializer = node.getInitializer();
  if (!Node.isObjectLiteralExpression(initializer)) {
    return [];
  }
  return initializer.getProperties();
};
