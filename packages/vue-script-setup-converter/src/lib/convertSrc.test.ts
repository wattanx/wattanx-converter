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
});
