'use strict';

const dotenv = require('dotenv');
const chalk = require('chalk');
const webpack = require('webpack');
const Spinner = require('cli-spinner').Spinner;
const paths = require('../config/paths');

process.env.NODE_ENV = 'production';

dotenv.config();
let env = Object.keys(process.env)
  .filter(key => key.startsWith('APP_') || key === 'NODE_ENV')
  .reduce((e, key) => {
    e[key] = JSON.stringify(process.env[key]);
    return e;
  }, {});

const webpackConfig = require('../config/webpack.prod.config')(env);

console.log(chalk.cyan(
  `\nThis command will build the webpack bundle/s. \
If you want to serve these files on a web server, then run yarn serve after the build has finished.`));

let spinner = new Spinner(chalk.cyan('%s Webpack is bundling the files...'));
spinner.setSpinnerString(18);
spinner.start();

const compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
  spinner.stop();
  console.log('\n');
  if (err) {
    console.log(chalk.red('Webpack failed to compile. Check your configuration.\n'));
    console.log(chalk.red(err.stack || err));
    if (err.details) {
      console.error(chalk.red(err.details));
    }
    return;
  }

  const output = stats.toJson('normal');

  if (stats.hasErrors()) {
    console.log(chalk.redBright('Webpack failed to compile. Try again.\n'));
    console.log(chalk.redBright(`Webpack found ${output.errors.length} errors.`));
    console.log(chalk.redBright('Errors:'));
    output.errors.forEach(error => {
      console.log(chalk.redBright(`${error}`));
    });
    console.log('\n');
  }

  if (stats.hasWarnings()) {
    console.log(chalk.yellowBright(`Webpack found ${output.warnings.length} warnings.`));
    console.log(chalk.yellowBright('WARNINGS:'));
    output.warnings.forEach((warning, i)=> {
      console.log(chalk.yellowBright(`${warning}`));
    });
    console.log('\n');
  }

  console.log(chalk.green('Webpack build completed successfully.'));
  console.log(chalk.green(`Output is in ${paths.appBuild}`));
});
