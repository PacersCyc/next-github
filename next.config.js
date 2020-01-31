const withCss = require('@zeit/next-css')
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

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

module.exports = withCss({
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${SCOPE}`
  }
})