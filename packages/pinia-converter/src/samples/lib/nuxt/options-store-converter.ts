import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
} from "ts-morph";
import { convertGetters } from "../converters/options";

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

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};
