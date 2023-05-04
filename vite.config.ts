import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["highlight.js/lib/core"],
    },
  },
});
