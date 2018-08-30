const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const getBaseConfig = require('./base.config.js')

const {
  isIpfs, projectRoot, getWebPlugins,
  bundleOutputPath, faviconOutputPath,
} = require('./common')

const dist = path.join(projectRoot, isIpfs ? 'dist-ipfs' : 'dist')

module.exports = merge(getBaseConfig('production'), {
  output: {
    path: dist,
    filename: bundleOutputPath + '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  plugins: [
    new CleanPlugin(dist, { root: projectRoot, exclude: [faviconOutputPath.replace(/\/$/, '')] }),
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          reserved: ['BigInteger', 'ECPair', 'Point']
        }
      }
    }),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    ...getWebPlugins(false),
  ]
})
