import { terser } from "rollup-plugin-terser";
import * as meta from "./package.json";

const config = {
  input: "index.js",
  external: Object.keys(meta.dependencies || {}).filter(key =>
    /^d3-/.test(key)
  ),
  output: {
    file: `${meta.name}.js`,
    name: "d3",
    format: "umd",
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${
      meta.version
    } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
    globals: Object.assign(
      {},
      ...Object.keys(meta.dependencies || {})
        .filter(key => /^d3-/.test(key))
        .map(key => ({ [key]: "d3" }))
    )
  },
  plugins: []
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];
