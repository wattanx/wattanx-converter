/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { SyntaxKind, Node } from 'ts-morph';

export const getNodeByKind = (
  node: Node,
  kind: SyntaxKind
): Node | undefined => {
  const find = (node: Node): Node | undefined => {
    return node.forEachChild((child) => {
      if (child.getKind() === kind) {
        return child;
      }
      return find(child);
    });
  };
  return find(node);
};
