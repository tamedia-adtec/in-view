import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

const info = require('./package');

const config = {
  entry: 'src/in-view.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  targets: [
    {
      dest: info.main,
      format: 'umd',
      moduleName: 'inView'
    },
    {
      dest: info.module,
      format: 'es'
    }
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.targets = [{
    dest: 'dist/in-view.min.js',
    format: 'umd',
    moduleName: 'inView'
  }];
  config.plugins.push(
    uglify()
  );
}

export default config;
