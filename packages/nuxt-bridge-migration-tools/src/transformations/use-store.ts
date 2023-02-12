import { findUseNuxtApp } from "./../utils/find-use-nuxt-app";
import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertUseStore: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useNuxtAppNode = findUseNuxtApp(root, j);

  const useStoreNode = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useStore",
      },
    },
  });

  if (useNuxtAppNode.length > 0) {
    const properties = [
      j.objectProperty(j.identifier("$store"), j.identifier("store")),
    ];

    useNuxtAppNode.find(j.ObjectPattern).forEach((x) => {
      j(x).replaceWith(j.objectPattern([...properties, ...x.node.properties]));
    });

    useStoreNode.remove();
    return;
  }

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
