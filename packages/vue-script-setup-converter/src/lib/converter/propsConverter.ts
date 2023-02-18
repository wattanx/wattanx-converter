import {
  CallExpression,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  PropertyAssignment,
  SyntaxKind,
  Node,
  ReturnStatement,
  MethodDeclaration,
  AsExpression,
} from "ts-morph";
import { getOptionsNode } from "../helper";

export const convertProps = (node: CallExpression, lang: string = "js") => {
  const propsNode = getOptionsNode(node, "props");

  if (!propsNode) {
    return "";
  }

  return lang === "ts"
    ? convertToDefinePropsForTs(propsNode)
    : convertToDefineProps(propsNode);
};

const convertToDefineProps = (node: PropertyAssignment) => {
  const child = node.getInitializer();

  if (!child) {
    throw new Error("props is empty.");
  }

  if (Node.isObjectLiteralExpression(child)) {
    const properties = child.getProperties();
    const value = properties.map((x) => x.getText()).join(",");
    return `const props = defineProps({${value}});`;
  }

  return `const props = defineProps(${child.getFullText()});`;
};

// 以下 type-based declaration用

type PropType =
  | {
      type: "array";
      propertyName: string;
    }
  | {
      type: "typeOnly";
      propertyName: string;
      typeValue: string;
    }
  | {
      type: "object";
      propertyName: string;
      typeValue?: string;
      required?: boolean;
      defaultValue?: string | boolean;
    };

const convertToDefinePropsForTs = (node: PropertyAssignment) => {
  const child = node.getInitializer();

  if (Node.isObjectLiteralExpression(child)) {
    const properties = child.getProperties();

    const arr: PropType[] = properties.map((x) => {
      if (!Node.isPropertyAssignment(x)) {
        throw new Error("property not found.");
      }

      const propObj = x.getInitializer();
      if (Node.isObjectLiteralExpression(propObj)) {
        return {
          ...convertPropsWithObject(propObj),
          propertyName: x.getName(),
        };
      }

      if (Node.isAsExpression(propObj)) {
        const typeValue = getPropTypeValue(propObj) ?? "";

        return {
          type: "typeOnly",
          typeValue,
          propertyName: x.getName(),
        };
      }

      const typeText = propObj?.getText() ?? "";

      return {
        type: "typeOnly",
        typeValue: typeMapping[typeText],
        propertyName: x.getName(),
      };
    });

    const props = convertToTypeDefineProps(arr);

    return props;
  }

  if (!Node.isArrayLiteralExpression(child)) {
    throw new Error("props not found.");
  }
  return `const defineProps(${child.getText()});`;
};

const convertToTypeDefineProps = (props: PropType[]) => {
  const members = props
    .map((x) => {
      if (x.type === "array") {
        return;
      }
      if (x.type === "object") {
        return `${x.propertyName}${
          isOptional(x.required, x.defaultValue) ? "?" : ""
        }: ${x.typeValue};`;
      }
      return `${x.propertyName}?: ${x.typeValue};`;
    })
    .filter(Boolean);

  const propType = `type Props = {${members.join("\n")}};`;

  const defineProps = `const props = defineProps<Props>();`;

  const hasDefault = props.find((x) => x.type === "object" && x.defaultValue);

  const defaultValueParams = props
    .map((x) => {
      if (x.type === "object" && x.defaultValue) {
        return `${x.propertyName}: ${x.defaultValue}`;
      }
    })
    .filter(Boolean)
    .join(",");

  const withDefaults = `const props = withDefaults(defineProps<Props>(), { ${defaultValueParams} });`;

  return hasDefault ? propType + withDefaults : propType + defineProps;
};

const convertPropsWithObject = (
  node: ObjectLiteralExpression
): {
  type: "object";
  typeValue: string;
  required?: boolean;
  defaultValue?: string | boolean;
} => {
  const properties = node.getProperties();

  const typeValue = getTypeValue(properties);

  const required = getPropsOption("required", properties);

  const defaultValue = getPropsOption("default", properties);

  return {
    type: "object",
    typeValue,
    required: required ? Boolean(required) : undefined,
    defaultValue,
  };
};

const getTypeValue = (properties: ObjectLiteralElementLike[]) => {
  const property = properties.find((x) => {
    if (!Node.isPropertyAssignment(x)) {
      return;
    }
    return x.getName() === "type";
  });

  const defaultValue = properties.find((x) => {
    if (Node.isMethodDeclaration(x)) {
      return x.getName() === "default";
    }
  });

  if (!property) {
    throw new Error("props property not found.");
  }

  if (!Node.isPropertyAssignment(property)) {
    throw new Error("props property not found.");
  }

  if (defaultValue) {
    if (Node.isMethodDeclaration(defaultValue)) {
      return getPropTypeByDefault(defaultValue) ?? "";
    }
  }

  const initializer = property.getInitializer();

  if (!initializer) {
    throw new Error("props property not found.");
  }

  if (Node.isAsExpression(initializer)) {
    return getPropTypeValue(initializer) ?? "";
  }

  return typeMapping[initializer.getText()];
};

const getPropTypeValue = (node: AsExpression) => {
  const propType = node.getTypeNode();

  if (Node.isTypeReference(propType)) {
    const arg = propType.getTypeArguments()[0];

    return arg.getType().getText();
  }
};

const getPropTypeByDefault = (propsNode: MethodDeclaration) => {
  const body = propsNode.getBody();
  if (Node.isBlock(body)) {
    const statement = body.getStatement(
      (x) => x.getKind() === SyntaxKind.ReturnStatement
    ) as ReturnStatement;
    const expression = statement.getExpression();

    if (
      Node.isObjectLiteralExpression(expression) ||
      Node.isArrayLiteralExpression(expression)
    ) {
      return expression.getType().getText();
    }
  }
};

const getPropsOption = (
  type: "required" | "default",
  properties: ObjectLiteralElementLike[]
) => {
  const property = properties.find((x) => {
    if (Node.isPropertyAssignment(x) || Node.isMethodDeclaration(x)) {
      return x.getName() === type;
    }
  });

  if (!property) {
    return;
  }

  if (Node.isMethodDeclaration(property)) {
    const body = property.getBody();
    if (Node.isBlock(body)) {
      const statement = body.getStatement(
        (x) => x.getKind() === SyntaxKind.ReturnStatement
      ) as ReturnStatement;
      const expression = statement.getExpression();

      if (
        Node.isObjectLiteralExpression(expression) ||
        Node.isArrayLiteralExpression(expression)
      ) {
        return expression.getText();
      }
    }
    return;
  }

  if (!Node.isPropertyAssignment(property)) {
    throw new Error("props property not found.");
  }

  const initializer = property.getInitializer();

  if (Node.isIdentifier(property.getInitializer())) {
    if (!initializer) {
      throw new Error("props property not found.");
    }
    return initializer.getText();
  } else {
    if (!initializer) {
      throw new Error("props property not found.");
    }
    if (
      isFalseKeyword(initializer.getKind()) ||
      isTrueKeyword(initializer.getKind())
    ) {
      return isTrueKeyword(initializer.getKind());
    }
    if (Node.isLiteralLike(initializer)) {
      return initializer.getText();
    }

    return initializer.getText();
  }
};

const isTrueKeyword = (kind: SyntaxKind) => {
  return kind === SyntaxKind.TrueKeyword;
};

const isFalseKeyword = (kind: number) => {
  return kind === SyntaxKind.FalseKeyword;
};

const isOptional = (required?: boolean, defaultValue?: string | boolean) => {
  return !required || defaultValue !== undefined;
};

const typeMapping: Record<string, string> = {
  String: "string",
  Number: "number",
  Boolean: "boolean",
  Object: "any",
};
