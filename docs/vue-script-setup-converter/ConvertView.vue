<script lang="ts" setup>
import { ref, watch } from "vue";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import { convertSrc } from "@wattanx/vue-script-setup-converter";
// @ts-ignore
import optionsApi from "./composition-api-ts.txt?raw";
hljs.registerLanguage("typescript", typescript);

const input = ref(optionsApi);
const output = ref("");
const hasError = ref(false);
watch(
  [input],
  () => {
    try {
      hasError.value = false;
      const outputText = convertSrc(input.value);
      const prettifiedHtml = hljs.highlightAuto(
        prettier.format(outputText, {
          parser: "typescript",
          plugins: [parserTypeScript],
        })
      ).value;
      output.value = prettifiedHtml;
    } catch (err) {
      hasError.value = true;
      console.error(err);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex h-full flex-col pt-4 md:flex-row">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row space-x-4 py-4">
        <p class="pl-4 text-base">Input: script and composition api</p>
      </div>
      <textarea
        class="text-md w-full flex-1 border-gray-800 border-1 border-solid p-2 leading-5"
        :class="{ hasError }"
        v-model="input"
      ></textarea>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row py-4">
        <label for="output-type" class="mr-2">Output: script setup</label>
      </div>
      <pre
        class="output-container hljs text-md w-full flex-1 select-all whitespace-pre-wrap border p-2 leading-5"
        v-html="output"
      ></pre>
    </div>
  </div>
</template>

<style scoped>
.output-container {
  max-height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  overflow-y: auto;
}
</style>
