import { expect, describe, it } from "vitest";
import { CallExpression, ScriptTarget, SyntaxKind, Project } from "ts-morph";
import { parse } from "@vue/compiler-sfc";
import { getNodeByKind } from "../helpers/node";
import { convertProps } from "./propsConverter";

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

  const props = convertProps(callexpression as CallExpression, lang);

  return props;
};

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

describe("basic", () => {
  it("defineProps", () => {
    const output = parseScript(source);

    expect(output).toMatchInlineSnapshot(`
      "const props = defineProps({msg: {
              type: String,
              default: 'HelloWorld'
            },foo: {
              type: String,
              required: true
            }});"
    `);
  });

  it("type-based defineProps", () => {
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {msg?: string;
      foo: string;};const props = withDefaults(defineProps<Props>(), { msg: 'HelloWorld' });"
    `);
  });

  it("custom validator", () => {
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
    const output = parseScript(source);

    expect(output).toMatchInlineSnapshot(`
      "const props = defineProps({msg: {
              type: String,
              default: 'HelloWorld'
            },foo: {
              type: String,
              required: true,
              validator(value) {
                return ["success", "warning", "danger"].includes(value)
              }
            }});"
    `);
  });
});

describe("type-based", () => {
  it("require and default", () => {
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
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {msg?: string;
      foo: string;};const props = withDefaults(defineProps<Props>(), { msg: 'HelloWorld' });"
    `);
  });

  it("default function", () => {
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
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {foo?: { msg: string; };
      bar?: string[];};const props = withDefaults(defineProps<Props>(), { foo: () => ({ msg: "Hello World" }),bar: () => (["foo", "bar"]) });"
    `);
  });

  it("default arrow function", () => {
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
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {foo?: { msg: string; };
      bar?: string[];};const props = withDefaults(defineProps<Props>(), { foo: () => ({ msg: "Hello World" }),bar: () => ["foo", "bar"] });"
    `);
  });

  it("default arrow function and return", () => {
    const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      foo: {
        type: Object,
        default: () => {
          return { msg: "Hello World" }
        }
      },
      bar: {
        type: Array,
        default: () => {
          return ["foo", "bar"]
        }
      }
    }
  })
  </script>`;
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {foo?: { msg: string; };
      bar?: string[];};const props = withDefaults(defineProps<Props>(), { foo: () => ({ msg: "Hello World" }),bar: () => (["foo", "bar"]) });"
    `);
  });

  it("non primitive", () => {
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
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {foo: Foo;
      items: string[];};const props = defineProps<Props>();"
    `);
  });

  it("non Object style", () => {
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
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {msg?: string;
      foo?: Foo;};const props = defineProps<Props>();"
    `);
  });

  it("default value is boolean", () => {
    const source = `<script lang="ts">
  import { defineComponent, toRefs, computed, ref } from 'vue';
  
  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  })
  </script>`;
    const output = parseScript(source, "ts");

    expect(output).toMatchInlineSnapshot(`
      "type Props = {msg: string;
      disabled?: boolean;};const props = withDefaults(defineProps<Props>(), { disabled: false });"
    `);
  });
});
