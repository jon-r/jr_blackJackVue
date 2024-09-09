import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    vue(),
    vueDevTools(),
    Unfonts({
      google: {
        families: [
          { name: "Material Symbols Rounded", styles: "wght@400" },
          { name: "Noto Sans", styles: "ital,wght@0,400..600;1,400" },
          { name: "Noto Serif", styles: "wght@400;600" },
        ],
      },
    }),
  ],
  resolve: { alias: { "~": path.resolve("src") } },
}));
