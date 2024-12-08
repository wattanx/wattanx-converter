import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
  MethodDeclaration,
  SyntaxKind,
} from "ts-morph";

export const convertGetters = (statements: Statement[]) => {
  const gettersStatement = statements.find((statement) => {
    if (Node.isVariableStatement(statement)) {
      const declaration = statement.getDeclarations()[0];
      return declaration.getName() === "getters";
    }
    return false;
  }) as VariableStatement | undefined;

  if (!gettersStatement) {
    return null;
  }

  const initializer = getInitializer(gettersStatement.getDeclarations()[0]);

  if (Node.isObjectLiteralExpression(initializer)) {
    initializer.getProperties().forEach((property) => {
      if (Node.isMethodDeclaration(property)) {
        convertContextToThis(property);
      }
    });
    return initializer;
  } else {
    return null;
  }
};

// Convert the variables used in the arguments of actions to this.
const convertContextToThis = (method: MethodDeclaration) => {
  const parameters = method.getParameters();
  const firstParamsText = parameters[0].getText();

  const propertyAccessExpressions = method.getDescendantsOfKind(
    SyntaxKind.PropertyAccessExpression
  );

  propertyAccessExpressions.forEach((x) => {
    if (x.getExpression().getText() === firstParamsText) {
      x.getExpression().replaceWithText("this");
    }
  });
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};
