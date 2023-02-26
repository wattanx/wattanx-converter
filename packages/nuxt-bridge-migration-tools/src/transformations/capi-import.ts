import { wrap, ASTTransformation } from "../wrapAstTransformation";

const capiMap = new Map([
  ["useContext", "useNuxtApp"],
  ["useStore", "useNuxtApp"],
  ["useAsync", "useLazyAsyncData"],
  ["useFetch", "useLazyFetch"],
  ["useMeta", "useHead"],
]);

export const transformCapiImport: ASTTransformation<any> = (
  { root, j },
  options
) => {
  root
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === "@nuxtjs/composition-api" ||
        path.node.source.value === "#imports"
    )
    .forEach((x) => {
      const specifiersLiteralArray = x.node.specifiers?.map((specifier) => {
        const name = specifier.local?.name ?? "";

        if (capiMap.has(name)) {
          return capiMap.get(name) ?? "";
        }
        return name;
      });

      const specifiers = [...new Set(specifiersLiteralArray)].map((name) =>
        j.importSpecifier(j.identifier(name))
      );

      j(x).replaceWith(
        j.importDeclaration(
          [...new Set(specifiers)],
          j.stringLiteral("#imports")
        )
      );
    });
};

export default wrap(transformCapiImport);
export const parser = "ts";
