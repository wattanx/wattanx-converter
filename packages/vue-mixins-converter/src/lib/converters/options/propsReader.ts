import { Node, ObjectLiteralElementLike, ts } from 'ts-morph';
import { nonNull } from '../../helper';

export const propReader = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): string[] => {
  if (!ts.isPropertyAssignment(node)) return [];

  if (ts.isObjectLiteralExpression(node.initializer)) {
    return node.initializer.properties
      .map((prop) => {
        if (!ts.isPropertyAssignment(prop)) return null;
        return prop.name.getText(sourceFile);
      })
      .filter(nonNull);
  } else if (ts.isArrayLiteralExpression(node.initializer)) {
    return node.initializer.elements
      .map((el) => {
        if (ts.isStringLiteral(el)) return el.text;
      })
      .filter(nonNull);
  }
  return [];
};

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
