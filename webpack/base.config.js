const webpack = require('webpack')
const path = require('path')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const {
  isMocking, publicPath,
  projectRoot, src, res, test, nodeModules,
  assetOutputPath, bundleOutputPath,
} = require('./common')

module.exports = (NODE_ENV) => {
  const isDev = NODE_ENV === 'development'

  const jsLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    }
  }

  const cssLoader = ({ sourceMap = true, modules = true } = {}) => ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
      loader: 'css-loader', // translates CSS into CommonJS modules
      options: {
        sourceMap,
        modules,
        minimize: false, // CSS minification handled by OptimizeCssAssetsPlugin
        importLoaders: 2,
        localIdentName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64]'
      }
    }, {
      loader: 'postcss-loader', // Run post css actions
      options: {
        sourceMap,
        config: {
          path: path.resolve(__dirname, './postcss.config.js'),
        }
      }
    }, {
      loader: 'sass-loader', // compiles SASS to CSS
      options: { 
        sourceMap,
        includePaths: [nodeModules],
        sourceMapContents: true,
        outputStyle: 'expanded',
        precision: 6,
      }
    }]
  })

  const assetLoader = (subDir) => ({
    loader: 'file-loader',
    options: {
      context: projectRoot,
      outputPath: assetOutputPath,
      name: isDev ? '[path][name].[ext]' : `${subDir}/[hash].[ext]`
    }
  })
  const imgAssetLoader = assetLoader('img')
  const fontAssetLoader = assetLoader('font')
  const fileAssetLoader = assetLoader('file')

  return {
    context: projectRoot,
    entry: path.join(src, 'index.jsx'),
    output: {
      publicPath,
    },
    node: {
      fs: 'empty',
      __filename: true,
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          jsLoader,
          { loader: 'ts-loader' },
        ]
      }, {
        test: /\.jsx?$/,
        rules: [{
          resourceQuery: /worker/,
          loader: 'worker-loader',
          options: {
            name: bundleOutputPath + 'worker.[hash].js'
          }
        }, {
          exclude: /node_modules/,
          use: [jsLoader]
        }]
      }, {
        test: /(\.css|\.scss)$/,
        oneOf: [{
          resourceQuery: /nsm/,
          use: cssLoader({ modules: false })
        }, {
          use: cssLoader(),
        }]
      }, {
        resourceQuery: /file/,
        use: fileAssetLoader
      }, {
        test: /\.svg$/,
        oneOf: [{     
          resourceQuery: /inline/,
          loader: 'svg-react-loader'
        }, {
          use: imgAssetLoader
        }]
      }, {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/,
        use: imgAssetLoader
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: fontAssetLoader
      }]
    },
    resolve: {
      alias: {
        Pkg: path.join(projectRoot, 'package.json'),
        Src: src,
        Res: res,
        Test: test,
        Img: 'Res/img',
        Mock: 'Test/mock',
        Config: 'Src/config',
        Utilities: 'Src/utilities',
        Services: isMocking ? 'Mock/services' : 'Src/services',
        App: 'Src/app',
        Components: 'App/components',
        Styles: 'App/styles',
        Actions: 'App/actions',
        Hoc: 'App/hoc',
        Selectors: 'App/selectors',
        Routes: 'App/routes',
        Log: 'Utilities/log',
        Types: 'Src/types',
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.ROUTER_BASE_NAME': JSON.stringify(publicPath),
        'process.env.IPFS': JSON.stringify(process.env.IPFS),
        SITE_URL: JSON.stringify(process.env.SITE_URL),
        API_URL: JSON.stringify(process.env.API_URL),
      }),
      new ExtractTextPlugin({
        filename: bundleOutputPath + '[name].[contenthash].css',
        ignoreOrder: true,
        disable: isDev,
      }),
      new HardSourcePlugin(),
    ]
  }
}
