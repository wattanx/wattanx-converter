# Vue Composition Converter

Convert optionsAPI into composition API

Forked from https://github.com/miyaoka/vue-composition-converter

## convert options into `setup`

- data, computed, watch, methods, lifecycle, props -> setup()
  - data -> ref()
  - computed -> computed()
  - watch -> watch()
  - methods -> function
  - lifecycle -> lifecycle hooks
    - beforeCreate, created -> Immediate function
  - props -> toRefs()

## convert `this`

- this.prop
  - (toRefs, ref, computed) -> prop.value
  - (other) -> prop
- this.$globalProp -> ctx.root.$globalProp
