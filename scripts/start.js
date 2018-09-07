/**
 * Create and start the webpack-dev-server for development
 */
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const paths = require('../config/paths')
const env = require('../config/env')('development')

// Webpack-dev-server configuration options
const config = {
  compress: true,
  contentBase: paths.appBuild,
  watchContentBase: true,
  hot: true,
  host: '0.0.0.0',
  publicPath: paths.publicPath,
  overlay: false,
  historyApiFallback: true,
  proxy: {
    '/api': JSON.parse(env.APP_API_URL)
  }
}

// Webpack configuration
const webpackConfig = require('../config/webpack.dev.config')(env)

const APP_HOST = JSON.parse(env.APP_HOST) || '0.0.0.0'
const APP_PORT = JSON.parse(env.APP_PORT) || 5200

WebpackDevServer.addDevServerEntrypoints(webpackConfig, config)
const compiler = webpack(webpackConfig)

// Since we're using the Node API, we have to set devServer options here
const devServer = new WebpackDevServer(compiler, config)

console.log(env)

// Launch WebpackDevServer
devServer.listen(APP_PORT, APP_HOST, err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan(`Starting the development server on ${APP_HOST}:${APP_PORT}...`))
})
