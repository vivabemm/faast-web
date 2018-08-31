const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const getBaseConfig = require('./base.config.js')

const { projectRoot } = require('./common')

module.exports = new SpeedMeasurePlugin().wrap(merge(getBaseConfig('production'), {
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
    new webpack.NamedModulesPlugin(),
  ],
}))
