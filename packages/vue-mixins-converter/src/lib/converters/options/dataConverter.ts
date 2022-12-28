import { ObjectLiteralElementLike, SyntaxKind, Node } from 'ts-morph';
import ts from 'typescript';
import { ConvertedExpression, getNodeByKind } from '../../helper';
import { getNodeByKind as _getNodeByKind } from '../../utils/getNodeByKind';

export const dataConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  const objNode = getNodeByKind(node, ts.SyntaxKind.ObjectLiteralExpression);

  if (!(objNode && ts.isObjectLiteralExpression(objNode))) return [];
  return objNode.properties
    .map((prop) => {
      if (!ts.isPropertyAssignment(prop)) return;
      const name = prop.name.getText(sourceFile);
      const text = prop.initializer.getText(sourceFile);
      return {
        use: 'ref',
        expression: `const ${name} = ref(${text})`,
        returnNames: [name],
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);
};

export const _dataConverter = (
  node: ObjectLiteralElementLike
): ConvertedExpression[] => {
  const objNode = _getNodeByKind(node, SyntaxKind.ObjectLiteralExpression);

  if (!(objNode && Node.isObjectLiteralExpression(objNode))) {
    return [];
  }

  return objNode
    .getProperties()
    .map((prop) => {
      if (!Node.isPropertyAssignment(prop)) {
        return;
      }
      const name = prop.getName();
      const text = prop.getInitializer()?.getText();
      return {
        use: 'ref',
        expression: `const ${name} = ref(${text})`,
        returnNames: [name],
      };
    })
    .filter(Boolean) as ConvertedExpression[];
};
