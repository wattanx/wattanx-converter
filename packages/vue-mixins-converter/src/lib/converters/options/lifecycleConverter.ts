import { ObjectLiteralElementLike } from 'ts-morph';
import { getMethodExpression } from '../../utils/getMethodExpression';

export const lifecycleConverter = (node: ObjectLiteralElementLike) =>
  getMethodExpression(node);
