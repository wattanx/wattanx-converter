import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertDefineNuxtPlugin: ASTTransformation<{
  lang?: string;
}> = (context, options) => {
  const { root, j } = context;

  const importDeclaration = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        local: {
          name: "defineNuxtPlugin",
        },
      },
    ],
  });

  if (importDeclaration.length === 0) {
    return;
  }

  const callExpression = root.find(j.CallExpression, {
    callee: {
      name: "defineNuxtPlugin",
    },
  });

  if (options.lang === "ts") {
    importDeclaration.forEach((x) => {
      j(x).replaceWith(
        j.importDeclaration(
          [
            j.importSpecifier(j.identifier("Context")),
            j.importSpecifier(j.identifier("Inject")),
          ],
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

        const jnjectParams = params[1];

        if (
          jnjectParams.type === "ObjectPattern" ||
          jnjectParams.type === "Identifier"
        ) {
          jnjectParams.typeAnnotation = j.typeAnnotation(
            j.genericTypeAnnotation(j.identifier("Inject"), null)
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

export default wrap(convertDefineNuxtPlugin);
export const parser = "ts";
