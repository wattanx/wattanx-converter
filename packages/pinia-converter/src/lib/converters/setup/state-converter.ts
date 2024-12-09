import {
  Statement,
  VariableStatement,
  Node,
  VariableDeclaration,
  SyntaxKind,
} from "ts-morph";
import type { ConvertedExpression } from "./types";

type ReactiveState = {
  propertyName: string;
  value: string;
};

export const convertState = (
  statements: Statement[],
  useState?: boolean
): ConvertedExpression[] | null => {
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
    const objectLiteralExpression = initializer.getDescendantsOfKind(
      SyntaxKind.ObjectLiteralExpression
    )[0];

    const reactiveState = objectLiteralExpression
      .getProperties()
      .map((property) => {
        if (Node.isPropertyAssignment(property)) {
          return {
            propertyName: property.getName(),
            value: property.getInitializer()?.getText(),
          };
        }
      })
      .filter(Boolean);

    // @ts-expect-error
    return convertReactiveState(reactiveState, useState);
  } else {
    return null;
  }
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};

const convertReactiveState = (
  list: ReactiveState[],
  useState?: boolean
): ConvertedExpression[] => {
  return list.map((item) => {
    if (useState) {
      return {
        statement: `const ${item.propertyName} = useState("${item.propertyName}", () => ${item.value});\n`,
        returnName: item.propertyName,
      };
    }
    return {
      use: "ref",
      statement: `const ${item.propertyName} = ref(${item.value});\n`,
      returnName: item.propertyName,
    };
  });
};
