import { Collection, JSCodeshift } from "jscodeshift";

export const findUseNuxtApp = (root: Collection<any>, j: JSCodeshift) => {
  return root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "useNuxtApp",
      },
    },
  });
};
