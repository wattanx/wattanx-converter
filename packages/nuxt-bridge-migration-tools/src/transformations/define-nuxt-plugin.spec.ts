import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./define-nuxt-plugin";
import { test, expect } from "vitest";

test("js plugin", () => {
  const source = `import { defineNuxtPlugin } from '@nuxtjs/composition-api';
export default defineNuxtPlugin((ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
});
`;

  const expected = `export default (ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
};`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});

test("js async plugin", () => {
  const source = `import { defineNuxtPlugin } from '@nuxtjs/composition-api';
export default defineNuxtPlugin(async (ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
});
`;

  const expected = `export default async (ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
};`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});

test("ts plugin", () => {
  const source = `import { defineNuxtPlugin } from '@nuxtjs/composition-api';
export default defineNuxtPlugin((ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
});
`;

  const expected = `import type { Plugin } from '@nuxt/types';

export default <Plugin> function(ctx, inject) {
  inject('hello', (msg) => console.log('Hello World'));
};`;

  const result = applyTransform(
    transform,
    { lang: "ts" },
    {
      source,
    }
  );
  expect(result).toBe(expected);
});

test("ts async plugin", () => {
  const source = `import { defineNuxtPlugin } from '@nuxtjs/composition-api';
export default defineNuxtPlugin(async (ctx, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
});
`;

  const expected = `import type { Plugin } from '@nuxt/types';

export default <Plugin> async function(ctx, inject) {
  inject('hello', (msg) => console.log('Hello World'));
};`;

  const result = applyTransform(
    transform,
    { lang: "ts" },
    {
      source,
    }
  );
  expect(result).toBe(expected);
});

test("ts plugin with object params", () => {
  const source = `import { defineNuxtPlugin } from '@nuxtjs/composition-api';
export default defineNuxtPlugin(({ app, store }, inject) => {
  inject('hello', (msg) => console.log('Hello World'));
});`;

  const expected = `import type { Plugin } from '@nuxt/types';

export default <Plugin> function({ app, store }, inject) {
  inject('hello', (msg) => console.log('Hello World'));
};`;

  const result = applyTransform(
    transform,
    { lang: "ts" },
    {
      source,
    }
  );
  expect(result).toBe(expected);
});
