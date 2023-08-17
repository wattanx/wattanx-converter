import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
} from "ts-morph";

export const convertSetupStore = (statements: Statement[]) => {
  return "";
};

const convertState = (statements: Statement[]) => {
  const stateStatement = statements.find((statement) => {
    if (Node.isVariableStatement(statement)) {
      const declaration = statement.getDeclarations()[0];
      return declaration.getName() === "state";
    }
    return false;
  }) as VariableStatement | undefined;

  if (!stateStatement) {
    return null;
  }

  const initializer = getInitializer(stateStatement.getDeclarations()[0]);

  if (Node.isArrowFunction(initializer)) {
    return initializer;
  } else {
    return null;
  }
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};
