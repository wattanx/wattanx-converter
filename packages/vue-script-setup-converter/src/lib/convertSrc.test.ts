import { expect, describe, it } from "vitest";
import { convertSrc } from "./convertSrc";
import srcJs from "../samples/composition-api.txt?raw";
import srcTs from "../samples/composition-api-ts.txt?raw";

describe("lang=js", () => {
  it("convert", () => {
    const output = convertSrc(srcJs);
    expect(output).toMatchSnapshot();
  });
});

describe("lang=ts", () => {
  it("type-base declaration", () => {
    const output = convertSrc(srcTs);
    expect(output).toMatchSnapshot();
  });
});
