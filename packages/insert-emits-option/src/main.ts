import { handleCommand } from "./handlers";
import { colorize } from "consola/utils";
import { defineCommand } from "citty";
import pkgJson from "../package.json";
import { globby } from "globby";

export default defineCommand({
  meta: {
    name: pkgJson.name,
    version: pkgJson.version,
    description: pkgJson.description,
  },
  args: {
    targetFilePaths: {
      type: "positional",
      required: true,
      description:
        "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
    },
    tsconfigPath: {
      type: "string",
      required: false,
      alias: "t",
    },
  },
  async run({ args }) {
    const { targetFilePaths } = args;
    const files = await globby(targetFilePaths);
    const { insertedCount } = await handleCommand(files, args.tsconfigPath);
    console.log("\nCompleted 🎉");
    console.log(`${colorize("green", insertedCount)} files changed.`);
  },
});
