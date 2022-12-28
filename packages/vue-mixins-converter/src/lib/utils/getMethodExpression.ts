import { Node, ObjectLiteralElementLike, SyntaxKind } from 'ts-morph';
import { lifecycleNameMap } from '../helper';

export const storePath = `store`;

export const getMethodExpression = (node: ObjectLiteralElementLike) => {
  if (Node.isMethodDeclaration(node)) {
    const async = node
      .getModifiers()
      .some((mod) => mod.getKind() === SyntaxKind.AsyncKeyword)
      ? 'async'
      : '';

    const name = node.getName();
    const type = node.getReturnTypeNode()
      ? `: ${node.getReturnType().getText()}`
      : '';

    const body = node.getBody()?.getText() || '{}';
    const parameters = node
      .getParameters()
      .map((param) => param.getText())
      .join(',');

    const fn = `${async}(${parameters})${type} =>${body}`;

    if (lifecycleNameMap.has(name)) {
      const newLifecycleName = lifecycleNameMap.get(name);
      const immediate = newLifecycleName == null ? '()' : '';
      return [
        {
          use: newLifecycleName,
          expression: `${newLifecycleName ?? ''}(${fn})${immediate}`,
        },
      ];
    }
    return [
      {
        returnNames: [name],
        expression: `const ${name} = ${fn}`,
      },
    ];
  } else if (Node.isSpreadAssignment(node)) {
    const expressionNode = node.getExpression();
    // mapActions
    if (!Node.isCallExpression(expressionNode)) return [];

    const expression = expressionNode.getExpression();
    if (!Node.isIdentifier(expression)) return [];

    const mapName = expression.getText();
    const [namespace, mapArray] = expressionNode.getArguments();
    if (!Node.isStringLiteral(namespace)) return [];
    if (!Node.isArrayLiteralExpression(mapArray)) return [];

    const namespaceText = namespace.getLiteralText();
    const names = mapArray.getElements();

    if (mapName === 'mapActions') {
      return names.map((x) => {
        if (!Node.isStringLiteral(x)) {
          return [];
        }
        const name = x.getLiteralText();
        return {
          expression: `const ${name} = () => ${storePath}.dispatch('${namespaceText}/${name}')`,
          returnNames: [name],
        };
      });
    }
  }

  return [];
};
