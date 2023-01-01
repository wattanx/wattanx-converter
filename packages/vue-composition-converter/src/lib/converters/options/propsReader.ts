/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { Node, ObjectLiteralElementLike } from 'ts-morph';

export const propsReader = (node: ObjectLiteralElementLike): string[] => {
  if (!Node.isPropertyAssignment(node)) {
    return [];
  }

  const initializer = node.getInitializer();

  if (initializer && Node.isObjectLiteralExpression(initializer)) {
    return initializer
      .getProperties()
      .map((property) => {
        if (!Node.isPropertyAssignment(property)) {
          return null;
        }
        return property.getName();
      })
      .filter(Boolean) as string[];
  } else if (initializer && Node.isArrayLiteralExpression(initializer)) {
    return initializer
      .getElements()
      .map((element) => {
        if (!Node.isStringLiteral(element)) {
          return null;
        }
        return element.getText();
      })
      .filter(Boolean) as string[];
  }
  return [];
};
