const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const getBaseConfig = require('./base.config.js')

const { projectRoot } = require('./common')

module.exports = merge(getBaseConfig('development'), {
  devtool: 'inline-source-map',
  output: {
    path: path.join(projectRoot, 'dist-test'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
})
