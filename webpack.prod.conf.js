'use strict'

const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  mode: 'production',

  entry: {
    index: './src/index.js'
  },
  output: {
    path: resolve('./dist'),
    filename: 'index.js',
    publicPath: '/',
    library: 'InfiniteScroll',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },

  plugins: [
    new FriendlyErrorsPlugin(),
  ],

  devtool: '#source-map'
}