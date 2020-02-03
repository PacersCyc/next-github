const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const config = require('./config')

const configs = {
  distDir: 'build',
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2
  },
  pageExtensions: ['jsx', 'js'],
  generateBuildId: async() => {
    return null
  },
  webpack(config, options) {
    return config
  },
  webpackDevMiddleware: config => {
    return config
  },
  env: {
    customKey: 'cyc'
  },
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
}

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => ({})
}

module.exports = withBundleAnalyzer(withCss({
  webpack(config) {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return config
  },
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL
  },
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
}))