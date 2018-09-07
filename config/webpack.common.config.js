'use strict'

const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const paths = require('./paths')
const Dotenv = require('dotenv-webpack')

module.exports = env => {
  return {
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'development' ? 'eval' : 'sourc-emap',
    entry: {
      app: paths.appIndexJs,
      ...process.env.NODE_ENV === 'production' && { arrayIncludes: `${paths.config}/array-includes.polyfill.js` }
    },
    output: {
      path: paths.appBuild,
      filename: '[name].bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: paths.publicPath
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        paths.appSrc,
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          include: paths.appSrc
        },
        {
          test: require.resolve('tinymce/tinymce'),
          loaders: [
            'imports-loader?this=>window',
            'exports-loader?window.tinymce'
          ]
        },
        {
          test: /tinymce\/(themes|plugins)\//,
          loaders: [
            'imports-loader?this=>window'
          ]
        },
        {
          oneOf: [
            {
              test: /\.jsx?$/,
              include: /src/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      '@babel/preset-env',
                      '@babel/preset-react'
                    ],
                    plugins: [
                      '@babel/plugin-transform-runtime',
                      '@babel/plugin-transform-object-assign',
                      '@babel/plugin-proposal-object-rest-spread',
                      '@babel/plugin-transform-async-to-generator',
                      '@babel/plugin-proposal-class-properties',
                      process.env.NODE_ENV === 'development' && 'react-hot-loader/babel'
                    ]
                  }
                }
              ],
              exclude: /node_modules/
            },
            {
              test: /\.css$/,
              use: [
                process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    '-autoprefixer': true,
                    importLoaders: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          'last 2 Chrome versions'
                        ]
                      })
                    ]
                  }
                }
              ]
            },
            {
              test: /\.scss$/,
              use: [
                {
                  loader: 'style-loader'
                }, {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    '-autoprefixer': true,
                    importLoaders: true
                  }
                }, {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          'last 2 Chrome versions'
                        ]
                      })
                    ]
                  }
                }, {
                  loader: 'sass-loader'
                }
              ]
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery'
      }),
      new webpack.DefinePlugin(env),
      new CopyWebpackPlugin([{ from: paths.appPublic }]),
      new Dotenv()
    ]
  }
}