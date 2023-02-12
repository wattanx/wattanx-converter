import { wrap, ASTTransformation } from "../wrapAstTransformation";
import { transformCapiImport } from "./capi-import";
import { convertUseStore } from "./use-store";

const capiMap = new Map([
  ["useContext", "useNuxtApp"],
  ["useStore", "useNuxtApp"],
  ["useAsync", "useLazyAsyncData"],
  ["useFetch", "useLazyFetch"],
  ["useMeta", "useHead"],
]);

export const convertCapi: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;
  transformCapiImport(context, options);
  convertUseStore(context, options);
};

export default wrap(convertCapi);
export const parser = "ts";
