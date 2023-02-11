import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./capi-import";

test("API that does not exist in bridge is being converted.", () => {
  const result = applyTransform(
    transform,
    {},
    {
      source: `import { 
      defineComponent,
      ref,
      useContext,
      useStore,
      useAsync,
      useFetch
    } from '@nuxtjs/composition-api';`,
    }
  );
  expect(result).toBe(
    `import { defineComponent, ref, useNuxtApp, useLazyAsyncData, useLazyFetch } from '#imports';`
  );
});
