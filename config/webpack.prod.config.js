'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const paths = require('./paths');

module.exports = function makeConfig(env) {
  return {
    devtool: 'source-map',
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
        paths.appNodeModules,
        paths.appSrc
      ]
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|jsx)$/,
              include: paths.appSrc,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['es2015', 'react', 'stage-0'],
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
              loader:
                ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: true,
                      }
                    }, {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        ident: 'postcss',
                        plugins: () => [
                          autoprefixer({
                            browsers: [
                              'last 2 versions'
                            ]
                          }),
                        ],
                      },
                    },
                  ],
                }),
            },
            {
              test: /\.scss$/,
              loader: 'sass-loader'
            },
            {
              exclude: [/\.js$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),

      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        sourceMap: true
      }),

      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
      }),

      new ExtractTextPlugin({filename: 'css/[name].css', allChunks: true}),

      new CopyWebpackPlugin([{
        from: paths.appPublic
      }]),

      new webpack.DefinePlugin(env)
    ]
  };
};