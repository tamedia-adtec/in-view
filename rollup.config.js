import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

const config = {
  entry: 'src/in-view.js',
  dest: 'dist/in-view.js',
  moduleName: 'inView',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.dest = 'dist/in-view.min.js';
  config.plugins.push(
    uglify()
  );
}

export default config;
