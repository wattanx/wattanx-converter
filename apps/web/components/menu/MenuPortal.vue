<script setup lang="ts">
type Props = {
  to: string;
};

const props = defineProps<Props>();
</script>

<template>
  <Teleport :to="props.to">
    <slot />
  </Teleport>
</template>
