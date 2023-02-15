import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertDefineNuxtMiddleware: ASTTransformation<{
  lang?: string;
}> = (context, options) => {
  const { root, j } = context;

  const importDeclaration = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        local: {
          name: "defineNuxtMiddleware",
        },
      },
    ],
  });

  if (importDeclaration.length === 0) {
    return;
  }

  const callExpression = root.find(j.CallExpression, {
    callee: {
      name: "defineNuxtMiddleware",
    },
  });

  if (options.lang === "ts") {
    importDeclaration.forEach((x) => {
      j(x).replaceWith(
        j.importDeclaration(
          [j.importSpecifier(j.identifier("Context"))],
          {
            type: "Literal",
            value: "@nuxt/types",
          },
          "type"
        )
      );
    });

    callExpression.forEach((x) => {
      const argument = x.node.arguments[0];

      if (argument.type === "ArrowFunctionExpression") {
        const params = argument.params;
        const body = argument.body;

        const ctxParams = params[0];

        if (
          ctxParams.type === "ObjectPattern" ||
          ctxParams.type === "Identifier"
        ) {
          ctxParams.typeAnnotation = j.typeAnnotation(
            j.genericTypeAnnotation(j.identifier("Context"), null)
          );
        }

        j(x).replaceWith(j.arrowFunctionExpression(params, body));
      }
    });
    return;
  }

  importDeclaration.remove();

  callExpression.forEach((x) => {
    const argument = x.node.arguments[0];

    if (argument.type === "ArrowFunctionExpression") {
      const params = argument.params;
      const body = argument.body;

      j(x).replaceWith(j.arrowFunctionExpression(params, body));
    }
  });
};

export default wrap(convertDefineNuxtMiddleware);
export const parser = "ts";
