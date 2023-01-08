<script setup lang="ts">
type Props = {
  title: string;
  href: string;
  description: string;
};

const props = defineProps<Props>();
</script>
<template>
  <NuxtLink
    :to="href"
    class="flex w-[320px] flex-col items-center space-y-6 whitespace-pre-wrap rounded-lg border-none bg-gray-800 p-4 hover:bg-gray-700"
  >
    <p class="text-center text-xl font-bold">{{ title }}</p>
    <p class="text-md text-center">{{ description }}</p>
  </NuxtLink>
</template>
