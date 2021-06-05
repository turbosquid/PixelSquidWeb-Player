const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const express = require('express');
const url = require('url');
const request = require('request');
const bodyParser = require('body-parser');
const StringReplacementPlugin = require('string-replace-webpack-plugin');
const info = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;

const PS_API_DOMAIN = 'api.pixelsquid.com'

const common = {
  entry: './src/atlas_main.js',
  output: {
    library: 'PixelSquid',
    libraryTarget: 'umd',
    path: path.join(__dirname, "dist"),
    filename: 'pixelsquid-atlas.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /atlas_sprite_sheet_player.js/,
        loader: StringReplacementPlugin.replace({
          replacements: [
            {
              pattern: /<!-- @version -->/ig,
              replacement: function(match, pl, offset, string) {
                return info.version;
              }
            }
          ]
        })
      }
    ]
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      jquery: 'src/externals/jquery-1.12.3.min'
    }
  },
  plugins: [
    new StringReplacementPlugin()
  ]
};

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {});
}

if (TARGET === 'start') {
  //***
  //Proxy API Requests
  //***
  const app = express();
  app.use(bodyParser.json({ type: '*/*' }));

  const crossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization,Accept,Content-Type,X-Client-External-User-ID');
    next();
  };
  app.use(crossDomain);

  app.get('/api/products/:productId', function(req, res) {
    var query = url.parse(req.url, true);

    request({
      headers: {
        accept: req.headers.accept,
        authorization: req.headers.authorization,
        'x-client-external-user-id': req.headers['x-client-external-user-id']
      },
      uri: `https://${PS_API_DOMAIN}/api/products/${req.params.productId}${query.search}`
    }, function(apiErr, apiRes, apiBody) {
      res.contentType('application/json');
      res.send(apiBody);
    });
  });

  app.get('/api/products', function(req, res) {
    var query = url.parse(req.url, true);
    request({
      headers: {
        accept: req.headers.accept,
        authorization: req.headers.authorization,
        'x-client-external-user-id': req.headers['x-client-external-user-id']
      },
      uri: `https://${PS_API_DOMAIN}/api/products${query.search}`
    }, function(apiErr, apiRes, apiBody) {
      res.contentType('application/json');
      res.send(apiBody);
    });
  });

  app.post('/api/products/:productId/download_links', function(req, res) {
    var data = req.body;

    request.post({
      headers: {
        accept: req.headers.accept,
        authorization: req.headers.authorization,
        'x-client-external-user-id': req.headers['x-client-external-user-id']
      },
      uri: `https://${PS_API_DOMAIN}/api/products/${req.params.productId}/download_links`,
      json: req.body
    }, function(apiErr, apiRes, apiBody) {
      res.contentType('application/json');
      res.send(apiBody);
    });
  });

  app.listen(8081, '0.0.0.0', function() {
    console.log('http://0.0.0.0:8081');
    console.log(`api proxy: localhost -> ${PS_API_DOMAIN}`);
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
