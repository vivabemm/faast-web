const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const getBaseConfig = require('./base.config.js')

const {
  projectRoot, publicPath, bundleOutputPath, getWebPlugins,
} = require('./common')

const dist = path.join(projectRoot, 'dist-dev')

module.exports = merge(getBaseConfig('development'), {
  output: {
    path: dist,
    filename: bundleOutputPath + '[name].js',
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: dist,
    hot: true,
    historyApiFallback: {
      index: publicPath
    },
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...getWebPlugins(true)
  ]
})
