import cliProgress from "cli-progress";
import { blue, Color } from "colorette";

export const generateProgressBar = (
  colorFunc: Color = blue
): cliProgress.SingleBar =>
  new cliProgress.SingleBar(
    {
      format: `progress [${colorFunc(
        "{bar}"
      )}] {percentage}% | {value}/{total}`,
    },
    cliProgress.Presets.rect
  );
