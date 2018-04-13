'use strict'

const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const paths = require('./paths')

module.exports = function makeConfig(env) {
  return {
    devtool: 'cheap-module-source-map',
    entry: {
      app: paths.appIndexJs
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
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'dist/media/[name].[hash:8].[ext]'
              }
            },
            {
              test: /\.jsx?$/,
              include: /src/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['env', { modules: false }],
                      'react',
                      'stage-0'
                    ],
                    plugins: [
                      require('babel-plugin-transform-runtime'),
                      require('babel-plugin-transform-object-assign'),
                      require('babel-plugin-transform-object-rest-spread')
                    ]
                  }
                }
              ],
              exclude: /node_modules/
            },
            {
              test: /\.css$/,
              use: [
                'style-loader',
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
                          'last 2 versions'
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
                          'last 2 versions'
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
              loader: 'file-loader',
              options: {
                name: 'dist/media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery'
      }),

      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),

      new webpack.DefinePlugin(env),

      new CopyWebpackPlugin([
        {
          from: paths.appPublic
        }
      ])
    ]
  }
}
