# Vue Mixins Converter
Convert mixins to composables.

`vue-mixins-converter` is designed based on products involving wattanx individuals. Use at your own risk.

The core logic is based on the following repository.

https://github.com/miyaoka/vue-composition-converter

## Demo
https://vue-mixins-converter.vercel.app/

## convert options

- data, computed, watch, methods, lifecycle, props -> setup()
  - data -> ref()
  -  computed -> computed()
  - watch -> watch()
  - methods -> function
  - lifecycle -> lifecycle hooks
  - beforeCreate, created -> Immediate function
  - props -> toRefs()

> **Warning**
> 
> If props are defined, they must be passed to 'composables'.
>
> It is also necessary to define props on the component side.

Example

HogeMixins.js
```js
export default {
  props: {
    age: {
      type: Number,
      required: true
    }
  },
  data(): {
    return {
      hoge: ''
    }
  }
}
```

useHoge.js
```js
export const useHoge = (props) => {
  const { age } = toRefs(props);
  const hoge = ref('');
  return { hoge }
}
```

```vue
<script lang="ts">
export default defineComponent({
  props: {
    age: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    // 'useHoge' is composables converted by 'vue-mixins-converter'.
    const state = useHoge(props);
    return {
      ...state
    }
  }
})
</script>
```