import { test, expect } from "vitest";
import { convertSrc } from "./convert-src";

const source = `import { logger } from './logger'

export const state = () => ({
  counter: 0
})

export const getters = {
  getCounter(state) {
    return state.counter
  }
}

export const mutations = {
  increment(state) {
    logger.info("increment")
    state.counter++
  }
}

export const actions = {
  increment({ commit }) {
    console.log("increment action")
    commit("increment")
  },
  async fetchCounter({ state }) {
    // make request
    const res = { data: 10 };
    state.counter = res.data;
    return res.data;
  }
}`;

test("setup store converter", () => {
  const output = convertSrc({ input: source });

  expect(output).toMatchInlineSnapshot(`
    "import { logger } from './logger';
    import { ref } from "vue";
    export const useSampleStore = defineStore("sample", () => {
      const counter = ref(0);
      const getCounter = computed(() => {
        return counter.value;
      });
      const increment = () => {

        console.log("increment action");
        logger.info("increment");
        counter.value++;
      };

      const fetchCounter = async () => {

        // make request
        const res = { data: 10 };

        counter.value = res.data;

        return res.data;
      };

      return { counter, getCounter, increment, fetchCounter };
    });
    "
  `);
});

test("convert to useState", () => {
  const output = convertSrc({ input: source, outputType: "useState" });

  expect(output).toMatchInlineSnapshot(`
    "import { logger } from './logger';
    import { useState } from "#imports";
    export const useSampleStore = () => {
      const counter = useState("counter", () => 0);
      const getCounter = computed(() => {
        return counter.value;
      });
      const increment = () => {

        console.log("increment action");
        logger.info("increment");
        counter.value++;
      };

      const fetchCounter = async () => {

        // make request
        const res = { data: 10 };

        counter.value = res.data;

        return res.data;
      };

      return { counter, getCounter, increment, fetchCounter };
    };
    "
  `);
});
