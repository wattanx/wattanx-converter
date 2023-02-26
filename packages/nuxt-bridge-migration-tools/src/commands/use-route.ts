import type { Arguments, Argv } from "yargs";
import useRoute from "../transformations/use-route";
import { convertTargetFiles } from "../lib/convert-target-files";
import { executeTransform } from "../handlers/execute-transform";

type Options = {
  targetFilePaths: string[];
};

export const command = "use-route [targetFilePaths...]";
export const desc = "Removes `.value` from the return value of `useRoute`.";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs.positional("targetFilePaths", {
    array: true,
    type: "string",
    demandOption: true,
    description:
      "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
  } as const);

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetFilePaths } = argv;

  const targetFiles = await convertTargetFiles(targetFilePaths);

  executeTransform(targetFiles, useRoute);
};
