import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@ffx": resolve(__dirname, "."), // 👈 alias points to repo root
        },
    },
});
