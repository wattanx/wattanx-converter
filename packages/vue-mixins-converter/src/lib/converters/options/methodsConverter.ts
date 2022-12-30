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
