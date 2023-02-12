<script setup lang="ts">
definePageMeta({
  layout: "content",
});
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <h1 class="mb-8 text-2xl font-bold">{{ doc.title }}</h1>
    <Prose>
      <ContentRenderer :value="doc" />
    </Prose>
  </ContentDoc>
</template>
