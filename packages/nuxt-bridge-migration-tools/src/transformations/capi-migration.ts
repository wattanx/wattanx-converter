import { wrap, ASTTransformation } from "../wrapAstTransformation";
import { transformCapiImport } from "./capi-import";
import { convertUseContext } from "./use-context";
import { convertUseMeta } from "./use-meta";
import { convertUseStore } from "./use-store";

export const convertCapi: ASTTransformation<any> = (context, options) => {
  const { root, j } = context;
  transformCapiImport(context, options);
  convertUseStore(context, options);
  convertUseContext(context, options);
  convertUseMeta(context, options);
};

export default wrap(convertCapi);
export const parser = "ts";
