import {
  MethodDeclaration,
  Node,
  ObjectLiteralElementLike,
  PropertyAssignment,
  SyntaxKind,
} from 'ts-morph';
import ts from 'typescript';
import {
  ConvertedExpression,
  getInitializerProps,
  getPropsFromInitializer,
  nonNull,
} from '../../helper';

export const watchConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  return getInitializerProps(node)
    .map((prop) => {
      if (ts.isMethodDeclaration(prop)) {
        const name = prop.name.getText(sourceFile);
        const parameters = prop.parameters
          .map((param) => param.getText(sourceFile))
          .join(',');
        const block = prop.body?.getText(sourceFile) || '{}';

        return {
          use: 'watch',
          expression: `watch(${name}, (${parameters}) => ${block})`,
        };
      } else if (ts.isPropertyAssignment(prop)) {
        if (!ts.isObjectLiteralExpression(prop.initializer)) return;

        const props = prop.initializer.properties.reduce(
          (acc: Record<string, ts.ObjectLiteralElementLike>, prop) => {
            const name = prop.name?.getText(sourceFile);
            if (name) acc[name] = prop;
            return acc;
          },
          {}
        );

        const { handler, immediate, deep } = props;
        if (!(handler && ts.isMethodDeclaration(handler))) return;

        const options = [immediate, deep].reduce(
          (acc: Record<string, any>, prop) => {
            if (prop && ts.isPropertyAssignment(prop)) {
              const name = prop.name?.getText(sourceFile);
              if (name) {
                acc[name] = prop.initializer.kind === ts.SyntaxKind.TrueKeyword;
              }
            }
            return acc;
          },
          {}
        );

        const name = prop.name.getText(sourceFile);
        const parameters = handler.parameters
          .map((param) => param.getText(sourceFile))
          .join(',');
        const block = handler.body?.getText(sourceFile) || '{}';

        return {
          use: 'watch',
          expression: `watch(${name}, (${parameters}) => ${block}, ${JSON.stringify(
            options
          )} )`,
        };
      }
    })
    .filter(nonNull);
};

export const _watchConverter = (
  node: ObjectLiteralElementLike
): ConvertedExpression[] => {
  if (!Node.isPropertyAssignment(node)) {
    return [];
  }
  return getPropsFromInitializer(node)
    .map((prop) => {
      if (Node.isMethodDeclaration(prop)) {
        const name = prop.getName();
        const parameters = prop
          .getParameters()
          .map((param) => param.getText())
          .join(',');
        const block = prop.getBody()?.getText() || '{}';

        return {
          use: 'watch',
          expression: `watch(${name}, (${parameters}) => ${block})`,
        };
      } else if (Node.isPropertyAssignment(prop)) {
        const initializer = prop.getInitializer();
        if (!Node.isObjectLiteralExpression(initializer)) return;

        const props = initializer
          .getProperties()
          .reduce(
            (
              acc: Record<string, MethodDeclaration | PropertyAssignment>,
              prop
            ) => {
              if (
                Node.isPropertyAssignment(prop) ||
                Node.isMethodDeclaration(prop)
              ) {
                const name = prop.getName();
                if (name) acc[name] = prop;
                return acc;
              }
              return acc;
            },
            {}
          );

        const { handler, immediate, deep } = props;
        if (!(handler && Node.isMethodDeclaration(handler))) return;

        const options = [immediate, deep].reduce(
          (acc: Record<string, any>, prop) => {
            if (prop && Node.isPropertyAssignment(prop)) {
              const name = prop.getName();
              if (name) {
                acc[name] =
                  prop.getInitializer()?.getKind() === SyntaxKind.TrueKeyword;
              }
            }
            return acc;
          },
          {}
        );

        const name = prop.getName();
        const parameters = handler
          .getParameters()
          .map((param) => param.getText())
          .join(',');
        const block = handler.getBody()?.getText() || '{}';

        return {
          use: 'watch',
          expression: `watch(${name}, (${parameters}) => ${block}, ${JSON.stringify(
            options
          )} )`,
        };
      }
    })
    .filter(nonNull);
};
