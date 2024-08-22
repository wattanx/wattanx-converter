import cliProgress from "cli-progress";
import type { ColorFunction } from "consola/utils";
import { getColor } from "consola/utils";

const defaultColorFunc = getColor("green");

export const generateProgressBar = (
  colorFunc: ColorFunction = defaultColorFunc
): cliProgress.SingleBar =>
  new cliProgress.SingleBar(
    {
      format: `progress [${colorFunc(
        "{bar}"
      )}] {percentage}% | {value}/{total}`,
    },
    cliProgress.Presets.rect
  );
