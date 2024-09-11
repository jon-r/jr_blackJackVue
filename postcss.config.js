import purgecss from "@fullhuman/postcss-purgecss";
import postcssNested from "postcss-nested";

export default {
  plugins: [
    postcssNested,
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production" &&
      purgecss({
        content: [`./src/**/*.vue`, `./src/index.html`, "./src/**/*.css"],

        safelist: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
          /--\d+$/,
        ],
      }),
  ],
};
