/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { Node, ObjectLiteralElementLike } from 'ts-morph';
import { nonNull } from '@wattanx/converter-utils';
import { getPropsFromInitializer } from '../../utils/getPropsFromInitializer';
import { ConvertedExpression } from '../../types';

const storePath = 'store';

export const computedConverter = (
  node: ObjectLiteralElementLike
): ConvertedExpression[] => {
  if (!Node.isPropertyAssignment(node)) {
    return [];
  }
  return getPropsFromInitializer(node)
    .map((prop) => {
      if (Node.isSpreadAssignment(prop)) {
        // mapGetters, mapState
        const expressionNode = prop.getExpression();
        if (!Node.isCallExpression(expressionNode)) {
          return;
        }
        const expression = expressionNode.getExpression();
        const [namespace, mapArray] = expressionNode.getArguments();

        if (!Node.isIdentifier(expression)) {
          return;
        }

        const mapName = expression.getText();
        if (!Node.isStringLiteral(namespace)) {
          return;
        }
        if (!Node.isArrayLiteralExpression(mapArray)) {
          return;
        }

        const namespaceText = namespace.getLiteralText().includes('/')
          ? namespace.getLiteralText().replace('/', '.')
          : namespace.getLiteralText();
        const names = mapArray.getElements();

        switch (mapName) {
          case 'mapState':
            return names.map((x) => {
              if (!Node.isStringLiteral(x)) {
                return;
              }
              const name = x.getLiteralText();
              return {
                use: 'computed',
                expression: `const ${name} = computed(() => ${storePath}.state.${namespaceText}.${name})`,
                returnNames: [name],
              };
            });
          case 'mapGetters':
            return names.map((x) => {
              if (!Node.isStringLiteral(x)) {
                return;
              }
              const name = x.getLiteralText();
              return {
                use: 'computed',
                expression: `const ${name} = computed(() => ${storePath}.getters['${namespaceText}/${name}'])`,
                returnNames: [name],
              };
            });
        }
        return null;
      } else if (Node.isMethodDeclaration(prop)) {
        // computed method
        const typeName = prop.getReturnTypeNode()
          ? `: ${prop.getReturnType().getText()}`
          : '';
        const block = prop.getBody()?.getText() || '{}';
        const name = prop.getName();

        return {
          use: 'computed',
          expression: `const ${name} = computed(()${typeName} => ${block})`,
          returnNames: [name],
        };
      } else if (Node.isPropertyAssignment(prop)) {
        // computed getter/setter
        const initializer = prop.getInitializer();
        if (!Node.isObjectLiteralExpression(initializer)) return;

        const name = prop.getName();
        const block = initializer.getText() || '{}';

        return {
          use: 'computed',
          expression: `const ${name} = computed(${block})`,
          returnNames: [name],
        };
      }
    })
    .flat()
    .filter(nonNull);
};
