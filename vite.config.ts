import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "index.ts"),
        components: resolve(__dirname, "components/index.ts"),
        blueprints: resolve(__dirname, "components/blueprints/index.ts"),
        hooks: resolve(__dirname, "hooks/index.ts"),
        services: resolve(__dirname, "services/index.ts"),
        types: resolve(__dirname, "types/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@ffx": resolve(__dirname, "."),
    },
  },
});
