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
