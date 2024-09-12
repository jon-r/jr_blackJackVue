import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

import { purgeCssVariables, removeTempFiles } from "./scripts/purgeVariables";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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
    {
      name: "purge-css-variables",
      async buildStart() {
        if (command === "serve") return;
        await purgeCssVariables("./src");
      },
      async buildEnd() {
        if (command === "serve") return;
        await removeTempFiles("./src");
      },
    },
  ],
  resolve: {
    alias: {
      "~": path.resolve("src"),

      // this pairs with the 'purge-css-variables' plugin above
      variables: path.resolve(
        "src/styles",
        command === "serve" ? "variables" : "_variables",
      ),
    },
  },
}));
