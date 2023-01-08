<script setup lang="ts">
import MenuIcon from "./icons/MenuIcon.vue";

const emit = defineEmits<{ event: "iconClick" }>();
</script>
<template>
  <header
    class="sticky top-[-1px] z-50 mx-auto flex h-14 justify-between bg-gray-900 px-4"
  >
    <div class="flex flex-row items-center space-x-4">
      <MenuIcon class="cursor-pointer" @click="$emit('iconClick')" />
      <NuxtLink to="/">wattanx converter</NuxtLink>
    </div>
  </header>
</template>
