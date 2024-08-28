import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [vue(), vueDevTools()],
  resolve: { alias: { "~": path.resolve("src") } },
}));
