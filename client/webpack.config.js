'use strict';

const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: path.join(__dirname, '/app/index.js'),
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
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css?minimize!sass')
      },
      {
        include: path.resolve(__dirname, '../src/js'),
        exclude: /(node_modules)/,
        test: /\.js$/,
        loaders: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('../css/style.css'),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ]
};
if (NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        /* eslint camelcase: ["error", {properties: "never"}] */
        drop_console: true,
        unsafe: true
      },
      output: {
        comments: false
      }
    })
  );
}
