'use strict';
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
  entry: {
    index: ['./assets/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract(['css'])
    }, {
    test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=8192'
    }]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: module => /node_modules/.test(module.resource)
    })
  ]
}