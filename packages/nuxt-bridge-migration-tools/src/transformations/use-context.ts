import { findUseNuxtApp } from "../utils/find-use-nuxt-app";
import { wrap, ASTTransformation } from "../wrapAstTransformation";

export const convertUseContext: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;

  const useNuxtAppNode = findUseNuxtApp(root, j);

  const useContextNode = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useContext",
      },
    },
  });

  if (useNuxtAppNode.length > 0) {
    useContextNode.find(j.ObjectPattern).forEach((x) => {
      const properties = x.node.properties;

      useNuxtAppNode.find(j.ObjectPattern).forEach((x) => {
        j(x).replaceWith(
          j.objectPattern([...x.node.properties, ...properties])
        );
      });
    });

    useContextNode.remove();

    return;
  }

  useContextNode.forEach((x) => {
    j(x).replaceWith((p) => {
      return j.variableDeclarator.from({
        ...p.value,
        init: j.callExpression(j.identifier("useNuxtApp"), []),
      });
    });
  });
};

export default wrap(convertUseContext);
export const parser = "ts";
