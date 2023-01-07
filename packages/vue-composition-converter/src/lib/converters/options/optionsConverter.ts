/**
 * Copyright (c) 2021 Masaya Kazama. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of https://github.com/miyaoka/vue-composition-converter.
 */

import { lifecycleNameMap } from '../../../constants/lifecycleNameMap';
import { ConvertedExpression } from '../../types';
import { computedConverter } from './computedConverter';
import { dataConverter } from './dataConverter';
import { lifecycleConverter } from './lifecycleConverter';
import { methodsConverter } from './methodsConverter';
import { watchConverter } from './watchConverter';
import { propsReader } from './propsReader';
import {
  Node,
  SourceFile,
  ObjectLiteralExpression,
  SyntaxKind,
  ObjectLiteralElementLike,
  PropertyAssignment,
  MethodDeclaration,
} from 'ts-morph';
import { getNodeByKind } from '@wattanx/converter-utils';

export const optionsConverter = (sourceFile: SourceFile) => {
  const exportAssignNode = getNodeByKind(
    sourceFile,
    SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    const objectNode = getNodeByKind(
      exportAssignNode,
      SyntaxKind.ObjectLiteralExpression
    );
    if (objectNode && Node.isObjectLiteralExpression(objectNode)) {
      return _convertOptions(objectNode, sourceFile);
    }
  }
  const classNode = getNodeByKind(sourceFile, SyntaxKind.ClassDeclaration);
  if (classNode) {
    const decoratorNode = getNodeByKind(classNode, SyntaxKind.Decorator);

    if (decoratorNode) {
      const objectNode = getNodeByKind(
        decoratorNode,
        SyntaxKind.ObjectLiteralExpression
      );

      if (objectNode && Node.isObjectLiteralExpression(objectNode)) {
        return _convertOptions(objectNode, sourceFile);
      }
    }
  }

  return null;
};

const _convertOptions = (
  exportObject: ObjectLiteralExpression,
  sourceFile: SourceFile
) => {
  const otherProps: ObjectLiteralElementLike[] = [];
  const dataProps: ConvertedExpression[] = [];
  const computedProps: ConvertedExpression[] = [];
  const methodsProps: ConvertedExpression[] = [];
  const watchProps: ConvertedExpression[] = [];
  const lifecycleProps: ConvertedExpression[] = [];
  const propNames: string[] = [];

  exportObject.getProperties().forEach((prop) => {
    const name =
      (prop as PropertyAssignment | MethodDeclaration).getName() || '';
    switch (true) {
      case name === 'data':
        dataProps.push(...dataConverter(prop));
        break;
      case name === 'computed':
        computedProps.push(...computedConverter(prop));
        break;
      case name === 'watch':
        watchProps.push(...watchConverter(prop));
        break;
      case name === 'methods':
        methodsProps.push(...methodsConverter(prop));
        break;
      case lifecycleNameMap.has(name):
        lifecycleProps.push(...lifecycleConverter(prop));
        break;

      default:
        if (name === 'props') {
          propNames.push(...propsReader(prop));
        }

        // 該当しないものはそのままにする
        otherProps.push(prop);
        break;
    }
  });

  const propsRefProps: ConvertedExpression[] =
    propNames.length === 0
      ? []
      : [
          {
            use: 'toRefs',
            expression: `const { ${propNames.join(',')} } = toRefs(props)`,
            returnNames: propNames,
          },
        ];

  const setupProps: ConvertedExpression[] = [
    ...propsRefProps,
    ...dataProps,
    ...computedProps,
    ...methodsProps,
    ...watchProps,
    ...lifecycleProps,
  ];

  return {
    setupProps,
    propNames,
    otherProps,
  };
};
