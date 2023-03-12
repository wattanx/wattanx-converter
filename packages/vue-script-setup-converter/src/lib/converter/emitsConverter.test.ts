import { expect, test } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { getNodeByKind } from "../helper";
import { convertEmits } from "./emitsConverter";

const parseScript = (input: string, lang: "js" | "ts" = "js") => {
  const {
    descriptor: { script },
  } = parse(input);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const emits = convertEmits(callexpression as CallExpression, lang);

  const formatedText = prettier.format(emits, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  return formatedText;
};

const source = `<script>
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: {
    change: (value) => true,
  },
  setup(props, ctx) {
    ctx.emit("change", 124);

    return {
    }
  }
})
</script>`;

test("defineEmits", () => {
  const output = parseScript(source, "js");

  const expected = `const emit = defineEmits({ change: (value) => true });
`;

  expect(output).toBe(expected);
});

test("typed defineEmits", () => {
  const source = `<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: {
    change: (value: number) => true,
  },
  setup(props, ctx) {
    ctx.emit("change", 124);

    return {
    }
  }
})
</script>`;
  const output = parseScript(source, "ts");

  const expected = `const emit = defineEmits<{ (e: "change", value: number): void }>();
`;
  expect(output).toBe(expected);
});

test("string array", () => {
  const source = `<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: ['change'],
  setup(props, ctx) {
    ctx.emit("change", 124);

    return {
    }
  }
})
</script>`;
  const output = parseScript(source, "ts");

  const expected = `const emit = defineEmits(["change"]);
`;
  expect(output).toBe(expected);
});

test("validation", () => {
  const source = `<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: {
    change: (value: number) => {
      return value !== 0;
    },
  },
  setup(props, ctx) {
    ctx.emit("change", 124);

    return {
    }
  }
})
</script>`;
  const output = parseScript(source, "ts");

  const expected = `const emit = defineEmits({
  change: (value: number) => {
    return value !== 0;
  },
});
`;
  expect(output).toBe(expected);
});
