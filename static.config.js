import React from 'react'
import path from 'path'
import axios from 'axios'
import merge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { pick } from 'lodash'

const { dirs, useHttps } = require('./etc/common.js')
const getBaseConfig = require('./etc/webpack.config.base.js')
const siteConfig = require('./src/site/config.js')
const isDev = process.env.NODE_ENV === 'development'

const analyticsCode = `
(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:875945,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`

const Document = ({ Html, Head, Body, children, siteData }) => (
  <Html lang='en'>
    <Head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={siteConfig.description}/>
      <meta name='author' content={siteConfig.author}/>
      <meta name='referrer' content='origin-when-cross-origin'/>
      <link href='/static/vendor/ionicons-2.0/css/ionicons.min.css' rel='stylesheet'/>
      <link href='/static/vendor/font-awesome-5.5/css/all.min.css' rel='stylesheet'/>
      <link rel="icon" href="/favicon.png"/>
      <title>{siteData.title}</title>

      {/* Hotjar Tracking Code */}
      {!isDev && (
        <script dangerouslySetInnerHTML={{ __html: analyticsCode }}/>
      )}
    </Head>
    <Body>{children}</Body>
  </Html>
)

export default {
  entry: path.join(dirs.site, 'index.tsx'),
  siteRoot: process.env.SITE_ROOT || '', // Leave empty to build for all environments
  getSiteData: () => ({
    title: 'Trade Crypto - Faast',
    lastBuilt: Date.now(),
  }),
  Document,
  getRoutes: async () => {
    const { data: assets } = await axios.get('https://api.faa.st/api/v2/public/currencies')
    const supportedAssets = assets.filter(({ deposit, receive }) => deposit || receive)
      .map((asset) => pick(asset, 'symbol', 'name', 'iconUrl'))
    let mediumProfile = await axios.get('https://medium.com/faast?format=json')
    mediumProfile = JSON.parse(mediumProfile.data.replace('])}while(1);</x>', ''))
    const mediumPosts = Object.values(mediumProfile.payload.references.Post)
    return [
      {
        path: '/',
        component: 'src/site/pages/Home',
        getData: async () => ({
          supportedAssets
        })
      },
      {
        path: '/blog',
        component: 'src/site/pages/Blog',
        getData: async () => ({
          mediumPosts,
        }),
        children: await Promise.all(mediumPosts.map(async post => {
          let mediumPost = await axios.get(`https://medium.com/faast/${post.uniqueSlug}?format=json`)
          mediumPost = JSON.parse(mediumPost.data.replace('])}while(1);</x>', ''))
          return ({
            path: `/${post.uniqueSlug}`,
            component: 'src/site/pages/BlogPost',
            getData: async () => ({
              mediumPost,
            }),
          })
        })) 
      },
      {
        path: '/terms',
        component: 'src/site/pages/Terms',
      },
      {
        path: '/privacy',
        component: 'src/site/pages/Privacy',
      },
      {
        path: '/pricing',
        component: 'src/site/pages/Pricing',
      },
      {
        is404: true,
        component: 'src/site/pages/404',
      },
    ]
  },
  paths: {
    dist: dirs.buildSite,
  },
  devServer: {
    https: useHttps,
    host: useHttps ? 'https://localhost' : 'http://localhost',
  },
  webpack: (defaultConfig, { stage }) => {
    // Omit old version of UglifyJsPlugin because we use a newer one
    defaultConfig.plugins = defaultConfig.plugins.filter((plugin) =>
      plugin.constructor.name !== 'UglifyJsPlugin')

    const baseConfig = getBaseConfig(stage)

    const config = merge.strategy({
      'module.rules': 'replace',
    })(defaultConfig, baseConfig)
    if (stage === 'node') {
      // Needed for css modules to work. See https://github.com/nozzle/react-static/issues/601#issuecomment-429574588
      config.plugins = [
        ...config.plugins,
        new ExtractTextPlugin({
          filename: '_tmp/static.css',
        }),
      ]
    }
    return config
  },
}
