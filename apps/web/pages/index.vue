<script setup lang="ts">
import Card from "~~/components/Card.vue";
</script>

<template>
  <main class="container mx-auto flex items-center justify-center">
    <div
      class="flex min-h-screen flex-col flex-wrap items-center justify-center gap-4"
    >
      <Card
        title="Vue Composition Converter"
        description="Convert optionsAPI into composition API"
        href="/vue-composition-converter"
      />
      <Card
        title="Vue Mixins Converter"
        description="Convert mixins to composables."
        href="/vue-mixins-converter"
      />
      <Card
        title="Vue Script Setup Converter"
        description="This tool converts the vue composition api into a script setup."
        href="/vue-script-setup-converter"
      />
    </div>
  </main>
</template>
