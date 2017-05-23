import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const config = {
  entry: 'src/in-view.js',
  dest: 'dist/in-view.js',
  moduleName: 'inView',
  format: 'umd',
  plugins: [
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
