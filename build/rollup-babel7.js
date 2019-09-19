

// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/tapable.js',
    format: 'umd',
    name:"tapable"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false,useBuiltIns:"usage" }]],
    })
  ]
};
