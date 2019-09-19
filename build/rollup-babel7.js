

// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import {version} from './package.json';
export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/tapable.js',
    format: 'umd',
    name:"tapable",
    exports:"named",
    banner:`/**webpack tapable \n@version:${version}\n @build fyl build\n**/`,
    footer:"",
    intro:"var global=global||window;",
    outro:""
  },
  external:{
   // util:require('util')
  },
  plugins: [
    builtins(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false,useBuiltIns:false }]],
    })
  ]
};
