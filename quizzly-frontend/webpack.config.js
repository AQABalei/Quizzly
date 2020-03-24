'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

var isProduction = process.env.NODE_ENV == 'production';
console.log(isProduction);
console.log(process.env.NODE_ENV);
console.log(process.cwd());

var config = {
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  //XXX: Eric- Conner, I put this to fix an tinyurl error. Is this fine?
  // node: {
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty'
  // },
  node: {
    fs: 'empty',
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src', 'public'],
    root: path.resolve(__dirname, 'src/components'),
    extensions: ['', '.js', '.scss']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: isProduction ? ["react", "es2015", "stage-0"] : ["react", "es2015", "stage-0", "react-hmre"]
        }
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};


if(isProduction) {
  config.entry = './src';
  config.devtool = 'source-map';
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'DEV_ROOT_URL': JSON.stringify(process.env.DEV_ROOT_URL),
        'PROD_ROOT_URL': JSON.stringify(process.env.PROD_ROOT_URL)
      }
    })
  );
  config.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  );
} else {
  // config["start:dev"] = "webpack-dev-server --inline --content-base public --history-api-fallback";
  config.entry = [
    'webpack-hot-middleware/client?reload=true',
    './src'
  ];
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'DEV_ROOT_URL': JSON.stringify(process.env.DEV_ROOT_URL),
        'PROD_ROOT_URL': JSON.stringify(process.env.PROD_ROOT_URL)
      }
    })
  );
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = config;
