import { defineConfig } from "vitest/config";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["typescript", "ts-morph"],
    },
    emptyOutDir: false,
  },
  esbuild: {
    minifyIdentifiers: false,
  },
  test: {
    environment: "node",
  },
});
