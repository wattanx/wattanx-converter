import { expect, describe, it } from "vitest";
import { convertSrc } from "./convertSrc";
import srcJs from "../samples/composition-api.txt?raw";
import srcTs from "../samples/composition-api-ts.txt?raw";
import defineNuxtComponentSample from "../samples/define-nuxt-component.txt?raw";

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

describe("defineNuxtComponent", () => {
  it("convert", () => {
    const output = convertSrc(defineNuxtComponentSample);
    expect(output).toMatchSnapshot();
  });
});
