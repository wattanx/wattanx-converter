<script setup lang="ts">
type Props = {
  title: string;
  href: string;
  description: string;
  experimental?: boolean;
};

const props = defineProps<Props>();
</script>
<template>
  <NuxtLink
    :to="href"
    class="flex w-[320px] flex-col whitespace-pre-wrap rounded-lg border-none bg-gray-800 p-4 hover:bg-gray-700"
  >
    <div class="space-y-6">
      <div>
        <p class="text-xl font-bold">{{ title }}</p>
        <span v-if="props.experimental" class="text-orange-500"
          >experimental</span
        >
      </div>
      <p class="text-md">{{ description }}</p>
    </div>
  </NuxtLink>
</template>
