<script lang="ts" setup>
import { ref, watch } from "vue";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import { convertSrc } from "@wattanx/pinia-converter";
// @ts-ignore
import optionsApi from "./vuex.txt?raw";
hljs.registerLanguage("typescript", typescript);

const input = ref(optionsApi);
const output = ref("");
const hasError = ref(false);

const outputType = new Map<"pinia" | "useState", string>([
  ["pinia", "Pinia"],
  ["useState", "Nuxt useState"],
]);

const outputTypeKeys = [...outputType.keys()];
const selectedOutputType = ref(outputTypeKeys[0]);

watch(
  [input, selectedOutputType],
  () => {
    try {
      hasError.value = false;
      const outputText = convertSrc({
        input: input.value,
        outputType: selectedOutputType.value,
      });
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
        <p class="pl-4 text-base">Input: vuex store</p>
      </div>
      <textarea
        class="text-md w-full flex-1 border-gray-800 border-1 border-solid p-2 leading-5"
        :class="{ hasError }"
        v-model="input"
      ></textarea>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row py-2">
        <label for="output-type" class="mr-2">Output: </label>
        <select
          id="output-type"
          v-model="selectedOutputType"
          class="pl-2 h-6 outline-transparent rounded-md border-1 border-solid border-borderColor focus:outline-focused"
        >
          <option v-for="key in outputTypeKeys" :key="key" :value="key">
            {{ outputType.get(key) }}
          </option>
        </select>
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
