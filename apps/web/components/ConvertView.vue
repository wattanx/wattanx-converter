<script lang="ts" setup>
import { ref, watch } from "vue";
import prettier from "prettier";
import parserTypeScript from "prettier/parser-typescript";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/atom-one-dark.css";
import { convertSrc } from "@wattanx/vue-mixins-converter";
// @ts-ignore
import optionsApi from "~/assets/template/options-api.txt?raw";

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
  <div class="flex h-full flex-row">
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row space-x-4 py-4">
        <h2>Input: Vue2 Mixins</h2>
        <div>
          <label for="function-name">functionName: </label>
          <input
            id="function-name"
            class="border-1 border-borderColor focus:outline-focused rounded-md border-solid px-2 outline outline-2 outline-transparent"
            type="text"
            v-model="functionName"
          />
        </div>
      </div>
      <textarea
        class="text-md w-full flex-1 border p-2 leading-5"
        :class="{ hasError }"
        v-model="input"
      ></textarea>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row py-4">
        <label for="output-type" class="mr-2">Output: </label>
        <select
          id="output-type"
          v-model="selectedOutputType"
          class="border-1 border-borderColor focus:outline-focused rounded-md border-solid outline outline-2 outline-transparent"
        >
          <option v-for="key in outputTypeKeys" :key="key" :value="key">
            {{ outputType.get(key) }}
          </option>
        </select>
      </div>

      <pre
        class="hljs text-md w-full flex-1 select-all whitespace-pre-wrap border p-2 leading-5"
        v-html="output"
      ></pre>
    </div>
  </div>
</template>
