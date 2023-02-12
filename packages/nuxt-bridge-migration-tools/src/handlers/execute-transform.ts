import { green } from "colorette";
import { writeFile } from "fs/promises";
import runTransformation, { TransformationModule } from "../runTransformation";
import { generateProgressBar } from "../lib/generateProgressBar";

export const executeTransform = async (
  targetFiles: {
    path: string;
    fullText: string;
    script: string;
    lang: string;
  }[],
  transformer: TransformationModule
): Promise<void> => {
  const progressBar = generateProgressBar(green);
  progressBar.start(targetFiles.length, 0);

  for await (const file of targetFiles) {
    const fileInfo = {
      path: file.path,
      source: file.script,
    };
    try {
      const result = runTransformation(fileInfo, transformer, file.lang, {});

      const newText = file.fullText.replace(file.script, result);

      await writeFile(file.path, newText);

      progressBar.increment();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
  progressBar.stop();

  console.log("\nCompleted 🎉");
};
