import { BlockStatement } from "jscodeshift";
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

  const exportDefaultDeclaration = root.find(j.ExportDefaultDeclaration, {
    declaration: {
      callee: {
        name: "defineNuxtPlugin",
      },
    },
  });

  if (options.lang === "ts") {
    importDeclaration.forEach((x) => {
      j(x).replaceWith(
        j.importDeclaration(
          [j.importSpecifier(j.identifier("Plugin"))],
          {
            type: "Literal",
            value: "@nuxt/types",
          },
          "type"
        )
      );
    });

    exportDefaultDeclaration.forEach((x) => {
      const declaration = x.node.declaration;

      if (declaration.type === "CallExpression") {
        const argument = declaration.arguments[0];

        if (argument.type === "ArrowFunctionExpression") {
          const params = argument.params;
          const body = argument.body as BlockStatement;
          const isAsync = argument.async;

          const newFunc = j.functionExpression(null, params, body);
          newFunc.async = isAsync;

          j(x).replaceWith(
            j.exportDeclaration(
              true,
              j.tsTypeAssertion(
                j.tsTypeReference(j.identifier("Plugin"), null),
                newFunc
              )
            )
          );
        }
      }
    });

    return;
  }

  importDeclaration.remove();

  exportDefaultDeclaration.find(j.CallExpression).forEach((x) => {
    const argument = x.node.arguments[0];

    if (argument.type === "ArrowFunctionExpression") {
      const params = argument.params;
      const body = argument.body;
      const isAsync = argument.async;

      const newFunc = j.arrowFunctionExpression(params, body);
      newFunc.async = isAsync;

      j(x).replaceWith(newFunc);
    }
  });
};

export default wrap(convertDefineNuxtPlugin);
export const parser = "ts";
