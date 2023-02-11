import { DEFAULT_OPTIONS } from "../lib/constants";
import type { Arguments, Argv } from "yargs";
import { green } from "colorette";
import { writeFile } from "fs/promises";
import runTransformation from "../runTransformation";
import capiImport from "../transformations/capi-import";
import { generateProgressBar } from "../lib/generateProgressBar";
import { convertTargetFiles } from "../lib/convert-target-files";

type Options = {
  targetFilePaths: string[];
  tsconfigPath: string;
};

export const command = "capi-import [targetFilePaths...]";
export const desc = "Convert import '@nuxtjs/composition-api'.";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs.options(DEFAULT_OPTIONS).positional("targetFilePaths", {
    array: true,
    type: "string",
    demandOption: true,
    description:
      "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
  } as const);

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetFilePaths } = argv;

  const targetFiles = await convertTargetFiles(targetFilePaths);

  const progressBar = generateProgressBar(green);
  progressBar.start(targetFiles.length, 0);

  for await (const file of targetFiles) {
    const fileInfo = {
      path: file.path,
      source: file.script,
    };
    try {
      const result = runTransformation(fileInfo, capiImport, file.lang, {});

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
