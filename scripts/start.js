'use strict'

const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const paths = require('../config/paths')
const env = require('../config/env')('development')

const config = {
  compress: true,
  contentBase: paths.appBuild,
  watchContentBase: true,
  hot: true,
  host: '0.0.0.0',
  publicPath: paths.publicPath,
  overlay: false,
  historyApiFallback: true
}

// Webpack configuration
const webpackConfig = require('../config/webpack.dev.config')(env)

WebpackDevServer.addDevServerEntrypoints(webpackConfig, config)
const compiler = webpack(webpackConfig)

// Since we're using the Node API, we have to set devServer options here
const devServer = new WebpackDevServer(compiler, config)

// Launch WebpackDevServer
devServer.listen(3000, '0.0.0.0', err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan('Starting the development server on 0.0.0.0:3000...'))
})
