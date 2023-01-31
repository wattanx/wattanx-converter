import { DEFAULT_OPTIONS } from "./../lib/constants";
import type { Arguments, Argv } from "yargs";
import { handleCommand } from "../handlers";
import { green } from "colorette";

type Options = {
  targetFilePaths: string[];
  tsconfigPath: string;
};

export const command = "* [targetFilePaths...]";
export const desc = "Insert emits option in Vue files";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs.options(DEFAULT_OPTIONS).positional("targetFilePaths", {
    array: true,
    type: "string",
    demandOption: true,
    description:
      "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
  } as const);

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetFilePaths, tsconfigPath } = argv;
  const { insertedCount } = await handleCommand(targetFilePaths, tsconfigPath);

  console.log("\nCompleted 🎉");
  console.log(`${green(insertedCount)} files changed.`);
};
