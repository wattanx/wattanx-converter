import { wrap, ASTTransformation } from "../wrapAstTransformation";
import {
  ASTPath,
  CallExpression,
  JSCodeshift,
  ObjectExpression,
} from "jscodeshift";

const deprecatedApi = [
  "headAttrs",
  "__dangerouslyDisableSanitizers",
  "__dangerouslyDisableSanitizersByTagID",
  "changed",
  "afterNavigation",
];

export const convertUseMeta: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useMetaNode = root.find(j.CallExpression, {
    callee: {
      name: "useMeta",
    },
  });

  useMetaNode.forEach((x) => {
    const argument = x.node.arguments.at(0);

    if (argument?.type === "ArrowFunctionExpression") {
      const body = argument.body;

      if (body.type === "ObjectExpression") {
        const properties = body.properties;
        replace(x, j, properties);
      }
      return;
    }

    if (argument?.type === "ObjectExpression") {
      const properties = argument.properties;
      replace(x, j, properties);
    }
  });
};

const replace = (
  node: ASTPath<CallExpression>,
  j: JSCodeshift,
  properties: ObjectExpression["properties"]
) => {
  const filteredProperties = properties.filter((x) => {
    if (x.type === "Property") {
      const key = x.key;

      if (key.type === "Identifier") {
        return !deprecatedApi.includes(key.name);
      }
    }
    return true;
  });

  j(node).replaceWith(
    j.callExpression(j.identifier("useHead"), [
      j.objectExpression(filteredProperties),
    ])
  );
};

export default wrap(convertUseMeta);
export const parser = "ts";
