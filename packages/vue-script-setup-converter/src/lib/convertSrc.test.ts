import { expect, describe, it } from "vitest";
import { convertSrc } from "./convertSrc";

describe("snapshot", () => {
  it("lang=js", () => {
    const output = convertSrc(`<script>
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: {
    change: null
  },
  props: {
    msg: {
      type: String,
      default: 'HelloWorld'
    },
    foo: {
      type: String,
      required: true,
    }
  },
  setup(props, ctx) {
    const { msg, foo } = toRefs(props);
    const newMsg = computed(() => msg.value + '- HelloWorld');

    const count = ref(0);

    return {
      count,
      newMsg
    }
  }
})
</script>`);
    expect(output).toMatchSnapshot();
  });

  it("lang=ts", () => {
    const output = convertSrc(`<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  emits: {
    change: (value: number) => true,
  },
  props: {
    msg: {
      type: String,
      default: 'HelloWorld'
    },
    foo: {
      type: String
      required: true,
    }
  },
  setup(props, ctx) {
    const { msg, foo } = toRefs(props);
    const newMsg = computed(() => msg.value + '- HelloWorld');

    const count = ref(0);
    ctx.emit("change", 124);

    return {
      count,
      newMsg
    }
  }
})
</script>`);
    expect(output).toMatchSnapshot();
  });

  it("defineNuxtComponent", () => {
    const output = convertSrc(`<script lang="ts">
import { defineNuxtComponent, useNuxtApp } from '#imports';

export default defineNuxtComponent({
  name: 'HelloWorld',
  setup(props, ctx) {
    const { $client } = useNuxtApp();

    const onSubmit = () => {
      console.log('onSubmit')
    }

    return {
      onSubmit,
    }
  }
})
</script>
`);
    expect(output).toMatchSnapshot();
  });

  it("empty setup context", () => {
    const output = convertSrc(`<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: 'HelloWorld'
    }
  },
  setup(props) {
    const { msg } = toRefs(props);
    const newMsg = computed(() => msg.value + '- HelloWorld');

    return {
      newMsg
    }
  }
})
</script>`);
    expect(output).toBe(
      `
import { defineComponent, toRefs, computed } from 'vue';
type Props = { msg?: string; }; const props = withDefaults(defineProps<Props>(), { msg: 'HelloWorld' });

const { msg } = toRefs(props);
const newMsg = computed(() => msg.value + '- HelloWorld');
`
    );
  });

  it('props no toRefs', () => {
    const output = convertSrc(`<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: 'HelloWorld'
    }
  },
  setup(props) {
    const newMsg = computed(() => props.msg + '- HelloWorld');

    return {
      newMsg
    }
  }
})
</script>`);
    expect(output).toBe(
      `
import { defineComponent, computed } from 'vue';
type Props = { msg?: string; }; const props = withDefaults(defineProps<Props>(), { msg: 'HelloWorld' });

const newMsg = computed(() => props.msg + '- HelloWorld');
`
    );
  })
});
