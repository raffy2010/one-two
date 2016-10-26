'use strict';

var webpack = require('webpack');

var SRC_PATH = __dirname + '/';
var BUILD_PATH = __dirname + '/dist';

function hasArg(arg) {
  var regex = new RegExp('^' + ((arg.length === 2) ? ('-\\w*'+arg[1]+'\\w*') : (arg)) + '$');
  return process.argv.filter(regex.test.bind(regex)).length > 0;
}

var NODE_ENV = process.env['NODE_ENV'] ||
  (hasArg('-d') ||
  (hasArg('--debug')) ? 'development': 'production');

console.log('webpack env', NODE_ENV);

var plugins,
    output;

if (NODE_ENV === 'development') {
  plugins = [
    new webpack.DefinePlugin({
      DEBUG: true
    })
  ];

  output = {
    path: BUILD_PATH,
    filename: '[name].js'
  };
}

if (NODE_ENV === 'production') {
  plugins = [
    new webpack.DefinePlugin({
      DEBUG: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      sourceMap: false,
      compress: {
        warnings: false
      }
    })
  ];

  output = {
    path: BUILD_PATH,
    filename: '[name].min.js'
  };
}

module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  entry: {
    onetwo: './src/index.js'
  },
  stats: {
    colors: true,
    modules: true,
  },
  output: output,
  plugins: plugins
};
