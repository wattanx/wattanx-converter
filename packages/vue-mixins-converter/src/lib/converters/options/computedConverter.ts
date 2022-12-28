import { Node, ObjectLiteralElementLike } from 'ts-morph';
import ts from 'typescript';
import {
  ConvertedExpression,
  getInitializerProps,
  getPropsFromInitializer,
  nonNull,
  storePath,
} from '../../helper';

export const computedConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  return getInitializerProps(node)
    .map((prop) => {
      if (ts.isSpreadAssignment(prop)) {
        // mapGetters, mapState
        if (!ts.isCallExpression(prop.expression)) return;
        const { arguments: args, expression } = prop.expression;

        if (!ts.isIdentifier(expression)) return;
        const mapName = expression.text;
        const [namespace, mapArray] = args;
        if (!ts.isStringLiteral(namespace)) return;
        if (!ts.isArrayLiteralExpression(mapArray)) return;

        const namespaceText = namespace.text.includes('/')
          ? namespace.text.replace('/', '.')
          : namespace.text;
        const names = mapArray.elements as ts.NodeArray<ts.StringLiteral>;

        switch (mapName) {
          case 'mapState':
            return names.map(({ text: name }) => {
              return {
                use: 'computed',
                expression: `const ${name} = computed(() => ${storePath}.state.${namespaceText}.${name})`,
                returnNames: [name],
              };
            });
          case 'mapGetters':
            return names.map(({ text: name }) => {
              return {
                use: 'computed',
                expression: `const ${name} = computed(() => ${storePath}.getters['${namespaceText}/${name}'])`,
                returnNames: [name],
              };
            });
        }
        return null;
      } else if (ts.isMethodDeclaration(prop)) {
        // computed method
        const { name: propName, body, type } = prop;
        const typeName = type ? `:${type.getText(sourceFile)}` : '';
        const block = body?.getText(sourceFile) || '{}';
        const name = propName.getText(sourceFile);

        return {
          use: 'computed',
          expression: `const ${name} = computed(()${typeName} => ${block})`,
          returnNames: [name],
        };
      } else if (ts.isPropertyAssignment(prop)) {
        // computed getter/setter
        if (!ts.isObjectLiteralExpression(prop.initializer)) return;

        const name = prop.name.getText(sourceFile);
        const block = prop.initializer.getText(sourceFile) || '{}';

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

export const _computedConverter = (
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
