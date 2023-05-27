import type { Identifier, Property } from "jscodeshift";
import { convertUseRoute } from "./use-route";
import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertCapiLegacy: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useFetchDeclarator = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useFetch",
      },
    },
  });

  useFetchDeclarator.find(j.ObjectPattern).forEach((x) => {
    const properties = x.node.properties as Property[];
    properties.forEach((p) => {
      const key = p.key as Identifier;
      if (key.name === "$fetch") {
        key.name = "fetch";
      }
      if (key.name === "$fetchState") {
        key.name = "fetchState";
      }
    });
    j(x).replaceWith(j.objectPattern(properties));
  });

  convertUseRoute(context, options);
};

export default wrap(convertCapiLegacy);
export const parser = "ts";
