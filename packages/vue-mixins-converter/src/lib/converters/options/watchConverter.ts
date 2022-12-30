import {
  MethodDeclaration,
  Node,
  ObjectLiteralElementLike,
  PropertyAssignment,
  SyntaxKind,
} from 'ts-morph';
import { nonNull } from '../../utils/nonNull';
import { getPropsFromInitializer } from '../../utils/getPropsFromInitializer';
import { ConvertedExpression } from '../../types';

export const watchConverter = (
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
