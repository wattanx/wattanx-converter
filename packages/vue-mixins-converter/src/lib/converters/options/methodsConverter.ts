import { Node, ObjectLiteralElementLike } from 'ts-morph';
import ts from 'typescript';
import {
  ConvertedExpression,
  getInitializerProps,
  getMethodExpression,
  getPropsFromInitializer,
} from '../../helper';
import { getMethodExpression as _getMethodExpression } from '../../utils/getMethodExpression';

export const methodsConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  return getInitializerProps(node)
    .map((prop) => {
      return getMethodExpression(prop, sourceFile);
    })
    .flat();
};

export const _methodsConverter = (node: ObjectLiteralElementLike) => {
  if (!Node.isPropertyAssignment(node)) {
    return [];
  }
  return getPropsFromInitializer(node)
    .map((prop) => _getMethodExpression(prop))
    .flat();
};
