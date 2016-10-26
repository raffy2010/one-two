'use strict';

var webpack = require('webpack');

var BUILD_PATH = __dirname + '/';

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
    countdown: './index.js'
  },
  stats: {
    colors: true,
    modules: true,
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: true
    })
  ]
};
