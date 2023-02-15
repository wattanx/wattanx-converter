import { applyTransform } from "jscodeshift/src/testUtils";
import transform from "./define-nuxt-middleware";

test("js middleware", () => {
  const source = `import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
export default defineNuxtMiddleware(({ store, redirect }) => {
  if (!store.state.authenticated) {
    return redirect('/login')
  }
});
`;

  const expected = `export default ({ store, redirect }) => {
  if (!store.state.authenticated) {
    return redirect('/login')
  }
};`;

  const result = applyTransform(transform, null, {
    source,
  });
  expect(result).toBe(expected);
});

test("ts middleware", () => {
  const source = `import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
export default defineNuxtMiddleware(({ store, redirect }) => {
  if (!store.state.authenticated) {
    return redirect('/login')
  }
});
`;

  const expected = `import type { Context } from '@nuxt/types';
export default (
  {
    store,
    redirect,
  }: Context,
) => {
  if (!store.state.authenticated) {
    return redirect('/login')
  }
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
