import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allow non-relative @use "static/styles/base/base" (src on load path),
        // matching the old CRA sass-loader includePaths behaviour.
        loadPaths: [path.resolve(dirname, "src")],
        quietDeps: true,
        silenceDeprecations: ["import", "legacy-js-api"],
      },
    },
  },
  build: {
    outDir: "build",
  },
});
