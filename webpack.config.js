'use strict';
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: ['./assets/index.js'],
    manual: ['./assets/manual.js'],
    jquery: ['jquery']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/', // 一定要加/
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract(['css'])
    }, {
      test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.ejs$/,
      loader: 'underscore-template-loader'
    }]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: module => /node_modules/.test(module.resource)
    })
  ]
};
