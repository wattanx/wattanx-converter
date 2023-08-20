import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
  SyntaxKind,
  ObjectLiteralElementLike,
} from "ts-morph";
import type { ConverterMutation } from "./types";

export const convertMutations = (
  statements: Statement[]
): ConverterMutation[] => {
  const mutationsStatement = statements.find((statement) => {
    if (Node.isVariableStatement(statement)) {
      const declaration = statement.getDeclarations()[0];
      return declaration.getName() === "mutations";
    }
    return false;
  }) as VariableStatement | undefined;

  if (!mutationsStatement) {
    return [];
  }

  const initializer = getInitializer(mutationsStatement.getDeclarations()[0]);

  if (Node.isObjectLiteralExpression(initializer)) {
    const properties = initializer.getProperties();
    return createConvertedMutation(properties);
  } else {
    return [];
  }
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};

const createConvertedMutation = (
  properties: ObjectLiteralElementLike[]
): ConverterMutation[] => {
  return properties.map((property) => {
    if (Node.isMethodDeclaration(property)) {
      const parameters = property.getParameters();
      const firstParamsText = parameters[0].getText();

      const block = property.getBody();

      if (Node.isBlock(block)) {
        return {
          mutationName: property.getName(),
          statements: block
            .getStatements()
            .map((statement) => replaceState(statement, firstParamsText)),
        };
      }
    }
  });
};

const replaceState = (statement: Statement, replaceText: string) => {
  if (Node.isExpressionStatement(statement)) {
    const propertyAccessExpression = statement
      .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
      .at(0);

    const expression = statement.getExpression();

    if (propertyAccessExpression.getExpression().getText() === replaceText) {
      // (e.g.) state.count++ -> count.value++
      const regex = new RegExp(`${replaceText}\\.([\\w-]+)`, "g");
      return expression.getText().replace(regex, (_, p1) => `${p1}.value`);
    } else {
      return statement.getText();
    }
  }
};
