'use strict';

const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.js'),
  output: {
    path: path.join(__dirname, '..', 'app/static/javascript'),
    filename: 'bundle.js' 
  },
  devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : null,
  watch: NODE_ENV === 'development',
  watchOptions: {
    poll: true
  },
  resolve: {
    extensions: ['', '.js', '.scss'],
    fallback: path.join(__dirname, 'node_modules')
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    preLoaders: [
      {
        test: /.spec\.js$/,
        include: /specs/,
        exclude: /(bower_components|node_modules)/,
        loader: 'babel-loader'
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css?minimize!sass')
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('../css/style.css'),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ]
};
