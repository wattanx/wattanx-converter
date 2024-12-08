import type {
  Statement,
  VariableDeclaration,
  VariableStatement,
} from "ts-morph";
import { Node } from "ts-morph";
import type { ConvertedExpression } from "./types";
import { replaceState } from "../utils/replace-state";

export const convertGetters = (
  statements: Statement[]
): ConvertedExpression[] | null => {
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
    const properties = initializer.getProperties();

    const list = properties
      .map((property) => {
        if (Node.isMethodDeclaration(property)) {
          const parameters = property.getParameters();
          const firstParamsText = parameters[0].getText();

          const block = property.getBody();

          if (Node.isBlock(block)) {
            const newStatements = block
              .getStatements()
              .map((statement) => replaceState(statement, firstParamsText))
              .filter(Boolean) as string[];

            return {
              propertyName: property.getName(),
              statement: newStatements.join(""),
            };
          }
        }
      })
      .filter(Boolean) as { propertyName: string; statement: string }[];

    return convertToComputed(list);
  } else {
    return null;
  }
};

const getInitializer = (declaration: VariableDeclaration) => {
  return declaration.getInitializerOrThrow();
};

const convertToComputed = (
  list: { propertyName: string; statement: string }[]
): ConvertedExpression[] => {
  return list.map(({ propertyName, statement }) => {
    return {
      returnName: propertyName,
      statement: `const ${propertyName} = computed(() => {${statement}
});\n`,
      use: "computed",
    };
  });
};
