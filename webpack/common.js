const webpack = require('webpack')
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const FaviconPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const pkg = require('../package.json')

const isIpfs = process.env.IPFS === 'true'

const isMocking = Boolean(process.env.MOCK)

const projectRoot = path.resolve(__dirname, '..')
const src = path.join(projectRoot, 'src')
const res = path.join(projectRoot, 'res')
const test = path.join(projectRoot, 'test')
const nodeModules = path.join(projectRoot, 'node_modules')

const publicPath = isIpfs ? './' : '/portfolio/'

const assetOutputPath = 'asset/'
const vendorOutputPath = 'vendor/'
const bundleOutputPath = 'bundle/'
const faviconOutputPath = 'favicon/'

const vendorDeps = ['font-awesome/css/font-awesome.min.css']

const getWebPlugins = (isDev) => [
  new HtmlPlugin({
    template: path.join(src, 'index.html'),
    filename: 'index.html',
    title: pkg.productName,
    minify: isDev ? false : {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: true,
      removeEmptyAttributes: true,
    }
  }),
  new FaviconPlugin({
    logo: path.join(res, 'img', 'faast-logo.png'),
    prefix: faviconOutputPath + '[hash:8]/',
    title: pkg.productName,
    description: pkg.description,
    background: '#181818',
    emitStats: false,
    cache: true,
    inject: true
  }),
  new CopyPlugin([{ from: path.join(res, 'vendor'), to: vendorOutputPath }]),
  new IncludeAssetsPlugin({
    assets: vendorDeps.map((vendorDep) => path.join(vendorOutputPath, vendorDep)),
    append: false,
    hash: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => module.context && module.context.indexOf('node_modules') >= 0
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
]

module.exports = {
  isIpfs,
  isMocking,
  projectRoot,
  src,
  res,
  test,
  nodeModules,
  publicPath,
  assetOutputPath,
  vendorOutputPath,
  bundleOutputPath,
  faviconOutputPath,
  getWebPlugins,
}
