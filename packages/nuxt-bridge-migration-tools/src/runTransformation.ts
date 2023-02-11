import jscodeshift, { Transform, Parser } from "jscodeshift";
// @ts-ignore
import getParser from "jscodeshift/src/getParser";

type FileInfo = {
  path: string;
  source: string;
};

type JSTransformation = Transform & {
  parser?: string | Parser;
};

type JSTransformationModule =
  | JSTransformation
  | {
      default: Transform;
      parser?: string | Parser;
    };

type TransformationModule = JSTransformationModule;

export default function runTransformation(
  fileInfo: FileInfo,
  transformationModule: TransformationModule,
  lang: string,
  params: object = {}
) {
  let transformation: JSTransformation;
  // @ts-ignore
  if (typeof transformationModule.default !== "undefined") {
    // @ts-ignore
    transformation = transformationModule.default;
  } else {
    // @ts-ignore
    transformation = transformationModule;
  }

  const { source } = fileInfo;

  if (source === "") {
    return source;
  }

  let parser = getParser();
  let parserOption = (transformationModule as JSTransformationModule).parser;

  if (typeof parserOption !== "object") {
    if (lang.startsWith("ts")) {
      parserOption = lang;
    }
  }

  if (parserOption) {
    parser =
      typeof parserOption === "string" ? getParser(parserOption) : parserOption;
  }

  const j = jscodeshift.withParser(parser);
  const api = {
    j,
    jscodeshift: j,
    stats: () => {},
    report: () => {},
  };

  const out = transformation(fileInfo, api, params);
  if (!out) {
    return source;
  }

  return out;
}
