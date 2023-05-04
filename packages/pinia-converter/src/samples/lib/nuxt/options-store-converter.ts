import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
  MethodDeclaration,
} from "ts-morph";

export const convertOptionsStore = (statements: Statement[]) => {
  const state = convertState(statements);

  const getters = convertGetters(statements);

  const actions = convertActions(statements);

  let output = "";

  if (state) {
    output += `state: ${state.getText()},`;
  }

  if (getters) {
    output += `getters: ${getters.getText()},`;
  }

  if (actions) {
    output += `actions: ${actions.getText()},`;
  }

  return `{
  ${output}
}`;
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

const convertGetters = (statements: Statement[]) => {
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
    return initializer;
  } else {
    return null;
  }
};

const convertActions = (statements: Statement[]) => {
  const actionsStatement = statements.find((statement) => {
    if (Node.isVariableStatement(statement)) {
      const declaration = statement.getDeclarations()[0];
      return declaration.getName() === "actions";
    }
    return false;
  }) as VariableStatement | undefined;

  if (!actionsStatement) {
    return null;
  }

  const initializer = getInitializer(actionsStatement.getDeclarations()[0]);

  if (Node.isObjectLiteralExpression(initializer)) {
    return initializer;
  } else {
    return null;
  }
};

// actionsの引数の使っている変数をthisに変換する
const convertContextToThis = (method: MethodDeclaration) => {};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};
