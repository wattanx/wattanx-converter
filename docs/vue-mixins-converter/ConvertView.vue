<script lang="ts" setup>
import { ref, watch } from "vue";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import { convertSrc } from "@wattanx/vue-mixins-converter";
// @ts-ignore
import optionsApi from "./options-api.txt?raw";

hljs.registerLanguage("typescript", typescript);

const outputType = new Map([
  ["vue2", "Vue 2 / Composition API"],
  ["nuxt2", "Nuxt 2.x / Composition API"],
]);

const outputTypeKeys = [...outputType.keys()];

const input = ref(optionsApi);
const functionName = ref("useMixinSample");
const output = ref("");
const selectedOutputType = ref(outputTypeKeys[0]);
const hasError = ref(false);

watch(
  [input, selectedOutputType, functionName],
  () => {
    const useNuxt = selectedOutputType.value === "nuxt2";
    try {
      hasError.value = false;
      const outputText = convertSrc({
        input: input.value,
        fileName: functionName.value,
        useNuxt,
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
      <div class="flex flex-col space-x-4 py-2">
        <p class="pl-4 text-base">Input: Vue2 Mixins</p>
        <div>
          <label for="function-name">functionName: </label>
          <input
            id="function-name"
            class="outline-transparent rounded-md border border-borderColor px-2 focus:outline-focused"
            type="text"
            v-model="functionName"
          />
        </div>
      </div>
      <textarea
        class="text-md w-full flex-1 p-2 leading-5 border-gray-800 border-1 border-solid"
        :class="{ hasError }"
        v-model="input"
      ></textarea>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row py-2 h-16">
        <label for="output-type" class="mr-2">Output: </label>
        <select
          id="output-type"
          v-model="selectedOutputType"
          class="pl-2 outline-transparent h-6 rounded-md border focus:outline-focused"
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
