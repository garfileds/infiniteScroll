'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  mode: 'development',

  entry: {
    index: './dev/main.js'
  },
  output: {
    path: resolve('./dev/dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('dev')]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'dev/index.html',
      filename: 'index.html',
      inject: true
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],

  devtool: '#source-map',

  devServer: {
    contentBase: resolve('dev'),
    hot: true,
    noInfo: true
  },
}