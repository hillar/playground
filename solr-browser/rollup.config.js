import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import sourcemaps from 'rollup-plugin-sourcemaps'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
export default {
  //sourceMap: true,
  // watch: true,
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    serve('dist'),
    livereload(),
    sourcemaps()
  ]
};
