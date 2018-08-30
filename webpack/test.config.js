const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const getBaseConfig = require('./base.config.js')

const { projectRoot } = require('./common')

module.exports = merge(getBaseConfig('development'), {
  output: {
    path: path.join(projectRoot, 'dist-test'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
})
