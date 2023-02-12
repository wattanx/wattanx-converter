<script setup lang="ts">
import Card from "~~/components/Card.vue";
</script>

<template>
  <div class="container mx-auto flex items-center justify-center">
    <div class="grid grid-cols-1 gap-4 py-8 md:grid-cols-2">
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
      <Card
        title="Insert Emits Option"
        description="Get the event name from the emit used in script or template and add it to the emits option as an array."
        href="/cli/insert-emits-option"
      />
      <Card
        title="Nuxt Bridge Migration Tools"
        description="A tool to support migration to Nuxt Bridge."
        href="/cli/nuxt-bridge-migration-tools"
      />
    </div>
  </div>
</template>
