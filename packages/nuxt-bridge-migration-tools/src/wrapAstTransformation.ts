import type { JSCodeshift, Core, FileInfo, API } from "jscodeshift";

export type Context = {
  root: ReturnType<Core>;
  j: JSCodeshift;
  filename: string;
};

export type ASTTransformation<Params = void> = {
  (context: Context, params: Params): void;
};

export function wrap<Params = any>(transformAST: ASTTransformation<Params>) {
  const transform = (file: FileInfo, api: API, options: Params) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    transformAST({ root, j, filename: file.path }, options);

    return root.toSource({
      lineTerminator: "\n",
      quote: "single",
      trailingComma: true,
    });
  };

  return transform;
}
