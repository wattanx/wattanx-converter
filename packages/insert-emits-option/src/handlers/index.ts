import { parse } from "@vue/compiler-sfc";
import { readFile, writeFile } from "node:fs/promises";
import { Project } from "ts-morph";
import { generateProgressBar } from "../lib/generateProgressBar";
import { insertEmitsOption } from "../lib/insertEmitsOption";

export const handleCommand = async (
  targetFilePaths: string[],
  tsconfigPath: string
) => {
  const allFiles = await Promise.all(
    targetFilePaths.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const descriptor = parse(fullText).descriptor;
      const script = descriptor.script?.content ?? "";
      const template = descriptor.template?.content ?? "";
      return {
        path,
        fullText,
        script,
        template,
      };
    })
  );

  const targetFiles = allFiles.filter((file) => file.script !== "");

  const progressBar = generateProgressBar();
  progressBar.start(targetFiles.length, 0);

  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const targetFilesWithSourceFile = targetFiles.map((file) => {
    const sourceFile = project.createSourceFile(`${file.path}.ts`, file.script);

    return {
      ...file,
      sourceFile,
    };
  });

  let insertedCount = 0;
  for await (const file of targetFilesWithSourceFile) {
    const { result } = insertEmitsOption(file.sourceFile, file.template);

    if (!result) {
      progressBar.increment();
      continue;
    }

    const newText = file.fullText.replace(
      file.script,
      file.sourceFile.getFullText()
    );

    await writeFile(file.path, newText);

    insertedCount += 1;
    progressBar.increment();
  }

  progressBar.stop();

  return {
    insertedCount,
  };
};
