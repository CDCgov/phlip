'use strict'

const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const dotenv = require('dotenv')
const paths = require('../config/paths')

// Taking all the variables from .env files and turning them in process.env variables
dotenv.config()
let env = Object.keys(process.env)
  .filter(key => key.startsWith('APP_') || key === 'NODE_ENV')
  .reduce((e, key) => {
    e[key] = JSON.stringify(process.env[key])
    return e
  }, {})

// Environment variables
process.env.NODE_ENV = 'development'
const PORT = parseInt(process.env.APP_PORT, 10) || 3000
const HOST = process.env.APP_HOST || '0.0.0.0'

// Webpack configuration
const webpackConfig = require('../config/webpack.dev.config')(env)
const compiler = webpack(webpackConfig)

// Since we're using the Node API, we have to set devServer options here
const devServer = new WebpackDevServer(compiler, {
  compress: true,
  contentBase: paths.appPublic,
  watchContentBase: true,
  hot: true,
  host: '0.0.0.0',
  publicPath: paths.publicPath,
  overlay: false,
  historyApiFallback: true
})

// Launch WebpackDevServer
devServer.listen(PORT, HOST, err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan(`Starting the development server on ${HOST}:${PORT}...\n`))
})
