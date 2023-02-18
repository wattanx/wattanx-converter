import { expect, test } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import { getNodeByKind } from "../helper";
import { convertProps } from "./propsConverter";

const source = `<script>
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        default: 'HelloWorld'
      },
      foo: {
        type: String,
        required: true
      }
    }
  })
  </script>`;

test("defineProps", () => {
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression);

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `const props = defineProps({
  msg: {
    type: String,
    default: "HelloWorld",
  },
  foo: {
    type: String,
    required: true,
  },
});
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps", () => {
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { msg?: string; foo: string };
const props = withDefaults(defineProps<Props>(), { msg: "HelloWorld" });
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps with require and default pattern", () => {
  const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        required: true,
        default: 'HelloWorld'
      },
      foo: {
        type: String,
        required: true
      }
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { msg?: string; foo: string };
const props = withDefaults(defineProps<Props>(), { msg: "HelloWorld" });
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps with default function", () => {
  const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      foo: {
        type: Object,
        default() {
          return { msg: "Hello World" }
        }
      },
      bar: {
        type: Array,
        default() {
          return ["foo", "bar"]
        }
      }
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { foo?: { msg: string }; bar?: string[] };
const props = withDefaults(defineProps<Props>(), {
  foo: () => ({ msg: "Hello World" }),
  bar: () => ["foo", "bar"],
});
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps with default arrow function", () => {
  const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      foo: {
        type: Object,
        default: () => ({ msg: "Hello World" })
      },
      bar: {
        type: Array,
        default: () => ["foo", "bar"]
      }
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { foo?: { msg: string }; bar?: string[] };
const props = withDefaults(defineProps<Props>(), {
  foo: () => ({ msg: "Hello World" }),
  bar: () => ["foo", "bar"],
});
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps with non primitive", () => {
  const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref, PropType } from 'vue';
  import { Foo } from './Foo';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      foo: {
        type: Object as PropType<Foo>,
        required: true
      },
      items: {
        type: Array as PropType<string[]>,
        required: true
      }
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { foo: Foo; items: string[] };
const props = defineProps<Props>();
`;

  expect(formatedText).toBe(expected);
});

test("type-based defineProps with non Object", () => {
  const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref, PropType } from 'vue';
  import { Foo } from './Foo';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: String,
      foo: Object as PropType<Foo>
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression, "ts");

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `type Props = { msg?: string; foo?: Foo };
const props = defineProps<Props>();
`;

  expect(formatedText).toBe(expected);
});

test("custom validator", () => {
  const source = `<script>
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        default: 'HelloWorld'
      },
      foo: {
        type: String,
        required: true,
        validator(value) {
          return ["success", "warning", "danger"].includes(value)
        }
      }
    }
  })
  </script>`;
  const {
    descriptor: { script },
  } = parse(source);

  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile("s.tsx", script?.content ?? "");

  const callexpression = getNodeByKind(sourceFile, SyntaxKind.CallExpression);

  const props = convertProps(callexpression as CallExpression);

  const formatedText = prettier.format(props, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });

  const expected = `const props = defineProps({
  msg: {
    type: String,
    default: "HelloWorld",
  },
  foo: {
    type: String,
    required: true,
    validator(value) {
      return ["success", "warning", "danger"].includes(value);
    },
  },
});
`;

  expect(formatedText).toBe(expected);
});
