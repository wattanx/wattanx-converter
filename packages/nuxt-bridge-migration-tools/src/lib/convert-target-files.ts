import { parse } from "@vue/compiler-sfc";
import { readFile } from "fs/promises";

export const convertTargetFiles = async (targetFilePaths: string[]) => {
  const allFiles = await Promise.all(
    targetFilePaths.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const descriptor = parse(fullText).descriptor;

      const extension = (/\.([^.]*)$/.exec(path) || [])[0];

      const script =
        extension === ".vue"
          ? descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ""
          : fullText;
      const lang = descriptor.script?.lang ?? extension === ".ts" ? "ts" : "js";

      return {
        path,
        fullText,
        script,
        lang,
      };
    })
  );

  const targetFiles = allFiles.filter((file) => file.script !== "");
  return targetFiles;
};
