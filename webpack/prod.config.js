const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const CleanPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const getBaseConfig = require('./base.config.js')

const {
  isIpfs, projectRoot, getWebPlugins, uglifyPlugin,
  bundleOutputPath, faviconOutputPath,
} = require('./common')

const dist = path.join(projectRoot, isIpfs ? 'dist-ipfs' : 'dist')

module.exports = new SpeedMeasurePlugin().wrap(merge(getBaseConfig('production'), {
  output: {
    path: dist,
    filename: bundleOutputPath + '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  plugins: [
    new CleanPlugin(dist, { root: projectRoot, exclude: [faviconOutputPath.replace(/\/$/, '')] }),
    uglifyPlugin,
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new HardSourcePlugin(),
    ...getWebPlugins(false),
  ]
}))
