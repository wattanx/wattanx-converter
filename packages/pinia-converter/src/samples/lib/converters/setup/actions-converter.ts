import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
  ObjectLiteralElementLike,
  SyntaxKind,
  StringLiteral,
} from "ts-morph";
import type { ConvertedExpression, ConverterMutation } from "./types";
import { replaceState } from "../utils/replaceState";

export const convertActions = (
  statements: Statement[],
  mutations: ConverterMutation[]
): ConvertedExpression[] => {
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
    const properties = initializer.getProperties();
    replaceCommitStatement(properties, mutations);
    return createActions(properties);
  } else {
    return null;
  }
};

const replaceCommitStatement = (
  properties: ObjectLiteralElementLike[],
  mutations: ConverterMutation[]
) => {
  return properties.forEach((property) => {
    if (Node.isMethodDeclaration(property)) {
      const block = property.getBody();

      if (Node.isBlock(block)) {
        const newStatements = block
          .getStatements()
          .map((statement) => {
            if (Node.isExpressionStatement(statement)) {
              const expression = statement.getExpression();

              if (
                Node.isCallExpression(expression) &&
                expression.getText().includes("commit")
              ) {
                const mutationName = (
                  expression.getArguments()[0] as StringLiteral
                ).getLiteralText();

                const mutation = mutations.find(
                  (mutation) => mutation.mutationName === mutationName
                );

                if (mutation) {
                  return mutation.statements.join("\n");
                }
              } else {
                return replaceState(statement, "state");
              }
            } else {
              return statement.getFullText();
            }
          })
          .filter(Boolean);

        block.removeStatements([0, block.getStatements().length]);
        block.addStatements(newStatements);
      }
    }
  });
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};

const createActions = (
  properties: ObjectLiteralElementLike[]
): ConvertedExpression[] => {
  return properties.map((property) => {
    if (Node.isMethodDeclaration(property)) {
      const body = property.getBody()?.getFullText() || "{}";
      const funcName = property.getName();

      const type = property.getReturnTypeNode()
        ? `: ${property.getReturnType().getText()}`
        : "";

      const parameters = property.getParameters()[1]?.getText() ?? "";

      const async = property
        .getModifiers()
        .some((mod) => mod.getKind() === SyntaxKind.AsyncKeyword)
        ? "async "
        : "";

      const fn = `${async}(${parameters})${type} =>${body}`;

      return {
        statement: `const ${funcName} = ${fn}`,
        returnName: funcName,
      };
    }
  });
};
