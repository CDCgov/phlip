'use strict';

const dotenv = require('dotenv');
dotenv.config();
let env = Object.keys(process.env)
  .filter(key => key.startsWith('APP_') || key === 'NODE_ENV')
  .reduce((e, key) => {
    e[key] = JSON.stringify(process.env[key]);
    return e;
  }, {});

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('../config/webpack.dev.config')(env);
const PORT = parseInt(process.env.APP_PORT, 10) || 3000;
const HOST = process.env.APP_HOST || '0.0.0.0';

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler);

// Launch WebpackDevServer
devServer.listen(PORT, HOST, err => {
	if (err) {
		return console.log(err);
	}
	console.log(chalk.cyan(`Starting the development server on ${HOST}:${PORT}...\n`));
});