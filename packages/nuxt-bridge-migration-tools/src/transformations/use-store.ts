import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertUseStore: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useStoreNode = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useStore",
      },
    },
  });

  useStoreNode.forEach((x) => {
    j(x).replaceWith(
      j.variableDeclarator(
        j.objectPattern([
          j.objectProperty(j.identifier("$store"), j.identifier("store")),
        ]),
        j.callExpression(j.identifier("useNuxtApp"), [])
      )
    );
  });
};

export default wrap(convertUseStore);
export const parser = "ts";
