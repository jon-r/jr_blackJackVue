import purgecss from "@fullhuman/postcss-purgecss";
import postcssNested from "postcss-nested";

export default {
  plugins: [
    postcssNested,
    /*    purgecss({
      content: [`./src/!**!/!*.vue`, `./src/index.html`],
      safelist: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*!/,
      ],
      // todo review safely filtering variables. also turn purge off for dev
      // variables: true,
    }),*/
  ],
};
