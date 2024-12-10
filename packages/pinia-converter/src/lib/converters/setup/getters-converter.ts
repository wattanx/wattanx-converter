import type {
  Statement,
  VariableDeclaration,
  VariableStatement,
  ParameterDeclaration,
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
        let parameters: ParameterDeclaration[] = [];
        let block;
        let propertyName = "";

        if (Node.isPropertyAssignment(property)) {
          const initializer = property.getInitializer();
          if (!initializer || !Node.isArrowFunction(initializer)) return;

          parameters = initializer.getParameters();
          block = initializer.getBody();
          propertyName = property.getName();
        }

        if (Node.isMethodDeclaration(property)) {
          parameters = property.getParameters();
          block = property.getBody();
          propertyName = property.getName();
        }

        const firstParamsText = parameters[0].getText();

        if (Node.isArrowFunction(block)) {
          const regex = new RegExp(`${firstParamsText}\\.([\\w-]+)`, "g");

          return {
            propertyName,
            statement: `${block
              .getFullText()
              .replaceAll(regex, (_, p1) => `${p1}.value`)}`,
            isArrowFunction: true,
          };
        }

        if (Node.isBlock(block)) {
          const newStatements = block
            .getStatements()
            .map((statement) => replaceState(statement, firstParamsText))
            .filter(Boolean) as string[];

          return {
            propertyName,
            statement: newStatements.join(""),
          };
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
  list: { propertyName: string; statement: string; isArrowFunction?: boolean }[]
): ConvertedExpression[] => {
  return list.map(({ propertyName, statement, isArrowFunction }) => {
    if (isArrowFunction) {
      return {
        returnName: propertyName,
        statement: `const ${propertyName} = computed(() => ${statement});\n`,
        use: "computed",
      };
    }
    return {
      returnName: propertyName,
      statement: `const ${propertyName} = computed(() => {${statement}
});\n`,
      use: "computed",
    };
  });
};
