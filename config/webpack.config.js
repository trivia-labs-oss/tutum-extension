'use strict'

const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common.js')
const PATHS = require('./paths')
const webpack = require('webpack')

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      contentScript: PATHS.src + '/content/index.ts',
      background: PATHS.src + '/background.ts',
      popup: PATHS.src + '/popup',
      injectedScript: PATHS.src + '/injected.ts',
    },
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: PATHS.src + '/popup/index.html',
        filename: 'popup.html',
        chunks: ['popup'],
        cache: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  })

module.exports = config
