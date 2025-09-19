import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        format: "esm",
      },
    },
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      esmExternals: true,
    },
    minify: "terser",
    sourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: "@workspace/ui",
        replacement: resolve(__dirname, "../../packages/ui/src"),
      },
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
  },
  optimizeDeps: {
    include: ["@workspace/ui"],
    esbuildOptions: {
      loader: { ".js": "jsx" },
      jsx: "automatic",
    },
  },
});
