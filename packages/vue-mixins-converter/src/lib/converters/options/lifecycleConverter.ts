import { ObjectLiteralElementLike } from 'ts-morph';
import ts from 'typescript';
import { ConvertedExpression, getMethodExpression } from '../../helper';
import { getMethodExpression as _getMethodExpression } from '../../utils/getMethodExpression';

export const lifecycleConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  return getMethodExpression(node, sourceFile);
};

export const _lifecycleConverter = (node: ObjectLiteralElementLike) =>
  _getMethodExpression(node);
