import { findUseNuxtApp } from "./../utils/find-use-nuxt-app";
import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertUseRoute: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useRouteNode = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useRoute",
      },
    },
  });

  useRouteNode.forEach((x) => {
    const id = x.node.id;
    if (id.type === "Identifier") {
      const name = id.name;

      const expressions = root.find(j.MemberExpression, {
        object: {
          object: {
            name,
          },
        },
      });

      expressions.forEach((p) => {
        const property = p.node.property;

        j(p).replaceWith(j.memberExpression(j.identifier(name), property));
      });
    }
  });
};

export default wrap(convertUseRoute);
export const parser = "ts";
