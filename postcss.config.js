import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer,
    cssnano({ preset: "default" }), // set default minification settings
  ],
};