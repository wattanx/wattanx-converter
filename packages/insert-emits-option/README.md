# Insert Emits Option
Get the event name from the emit used in script or template and add it to the emits option as an array.

In Vue3, it is recommended to set the emits option.

This tool is a tool to assist in the migration of the emits option.

This tool supports the **options api** and **composition api.**

## Usage

```bash
npx @wattanx/insert-emits-option <files...>
```

Path to the target vue file, which can be set with the glob pattern. eg: `src/**/*.vue`

### options

| option              | default         | description            |
| ------------------- | --------------- | ---------------------- |
| -t, --tsconfig-path | ./tsconfig.json | Path to tsconfig.json. |

## Example

before:

```vue
// HelloWorld.vue
<template>
  <div>
    <button @click="$emit('save', $event)">SAVE</button>
    <button @click="$emit('cancel')">CANCEl</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, computed, ref } from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup(_, { emit }) {
    const onChange = () => {
      emit("change", 124);
    };

    return {
      onChange,
    };
  },
});
</script>
```

after:

```diff
// HelloWorld.vue
<template>
  <div>
    <button @click="$emit('save', $event)">SAVE</button>
    <button @click="$emit('cancel')">CANCEl</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, computed, ref } from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup(_, { emit }) {
    const onChange = () => {
      emit("change", 124);
    };

    return {
      onChange,
    };
  },
+  emits: ["change",'save','cancel']
});
```

> ⚠️ It is always added to the end of the option without being formatted.
