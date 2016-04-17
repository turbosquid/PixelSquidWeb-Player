const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const express = require('express');
const url = require('url');
const request = require('request');

const TARGET = process.env.npm_lifecycle_event;

const common = {
  entry: './src/atlas_main.js',
  output: {
    library: 'PixelSquid',
    libraryTarget: 'umd',
    path: path.join(__dirname, "dist"),
    filename: 'pixelsquid-atlas.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: {
    'jquery': 'jQuery',
    'lodash': '_'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      jquery: 'examples/lib/jquery-1.12.3.min',
      underscore: 'examples/lib/lodash-4.9.0.min'
    }
  }
};

if (TARGET === 'build') {
  module.exports = merge(common, {});
}

if (TARGET === 'start' || !TARGET) {
  //***
  //Proxy API Requests
  //***
  const app = express();

  const crossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization,Accept,Content-Type');
    next();
  };
  app.use(crossDomain);

  app.get('/api/products/:productId/spinners/:productId', function(req, res) {
    request({
      headers: { accept: req.headers.accept, authorization: req.headers.authorization },
      uri: `http://api.pixelsquid.com/api/products/${req.params.productId}/spinners/${req.params.productId}`
    }, function(apiErr, apiRes, apiBody) {
      res.headers = { 'Content-Type': 'application/json' };
      res.send(apiBody);
    });
  });

  app.get('/api/products', function(req, res) {
    var query = url.parse(req.url, true);
    request({
      headers: { accept: req.headers.accept, authorization: req.headers.authorization },
      uri: `http://api.pixelsquid.com/api/products${query.search}`
    }, function(apiErr, apiRes, apiBody) {
      res.headers = { 'Content-Type': 'application/json' };
      res.send(apiBody);
    });
  });

  app.get('/api/products/:productId/download_links', function(req, res) {
    var query = url.parse(req.url, true);
    request.post({
      headers: {accept: req.headers.accept, authorization: req.headers.authorization },
      uri: `https://api.pixelsquid.com/api/products/${req.params.productId}/download_links`,
      form: query.query
    }, function(apiErr, apiRes, apiBody) {
      res.headers = { 'Content-Type': 'application/json' };
      res.send(apiBody);
    });
  });

  app.listen(8081, function() {
    console.log('http://localhost:8081');
    console.log('api proxy: localhost -> api.pixelsquid.com');
    console.log();
  });

  //***
  //Dev Server for Static Assets
  //***
  module.exports = merge(common, {
    devServer: {
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}
