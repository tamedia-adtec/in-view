const webpack = require('webpack'),
    path = require('path'),
    package = require('./package');
const banner = `${package.name} ${package.version} - ${package.description}\nCopyright (c) ${ new Date().getFullYear() } ${package.author} - ${package.homepage}\nLicense: ${package.license}`;
module.exports = {
    'context': path.join(__dirname, '/src'),
    'entry': './index.js',
    'output': {
        'path': __dirname + '/dist',
        'filename': `${package.name}.min.js`,
        'library': `inView`,
        'libraryTarget': 'umd'
    },
    'module': {
        rules: [{
            'test': /\.js$/,
            'exclude': /node_modules/,
            'loader': 'babel-loader',
            options: {
                presets: [
                    ["@babel/preset-env", { "targets": "> 0.25% and not dead and not op_mini all and not android 4.4.3-4.4.4" }]
                ]
            }
        }]
    },

    'plugins': [
    new webpack.BannerPlugin(banner)
]
};
