import { genImport } from "knitwork";
import type { Statement } from "ts-morph";
import {
  convertState,
  convertActions,
  convertMutations,
  convertGetters,
} from "../converters/setup";

type ConvertSetupStoreOptions = {
  storeName?: string;
  functionName?: string;
};

export const convertSetupStore = (
  statements: Statement[],
  {
    storeName = "sample",
    functionName = "useSampleStore",
  }: ConvertSetupStoreOptions = {}
) => {
  const state = convertState(statements);

  const getters = convertGetters(statements);

  const mutations = convertMutations(statements);

  const actions = convertActions(statements, mutations);

  let output = "";
  const imports = [];
  const returnNames = [];

  if (state) {
    output += state.map((x) => x.statement).join("\n");
    imports.push(
      ...(state
        .map((x) => x.use)
        .filter(Boolean)
        .flat() as string[])
    );
    returnNames.push(...state.map((x) => x.returnName).filter(Boolean));
  }

  if (getters) {
    output += getters.map((x) => x.statement).join("\n");
    returnNames.push(...getters.map((x) => x.returnName).filter(Boolean));
  }

  if (actions) {
    output += actions.map((x) => x.statement).join("\n");
    returnNames.push(...actions.map((x) => x.returnName).filter(Boolean));
  }

  return {
    output: `export const ${functionName} = defineStore("${storeName}", () => {
  ${output}
  return { ${returnNames.join(", ")} };
});`,
    imports,
  };
};
