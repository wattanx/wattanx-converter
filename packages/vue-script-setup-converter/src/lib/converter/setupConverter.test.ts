import { convertSetup } from "./setupConverter";
import { expect, test } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import optionsApi from "../../samples/composition-api.txt?raw";
import { getNodeByKind } from "../helpers/node";

test("setup statements", () => {
  const {
    descriptor: { script, scriptSetup },
  } = parse(optionsApi);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const statement = convertSetup(callexpression as CallExpression);

  expect(statement).toMatchInlineSnapshot(`
    "
        const { msg, foo } = toRefs(props);
        const newMsg = computed(() => msg.value + '- HelloWorld');

        const count = ref(0);"
  `);
});
