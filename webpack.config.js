const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
/*
,
    './src/atlas_available_download_formats.js',
    './src/atlas_client_capabilities.js',
    './src/atlas_constants.js',
    './src/atlas_control_adapter.js',
    './src/atlas_image_with_progress.js',
    './src/atlas_sphere.js',
    './src/atlas_sprite_sheet_controls.js',
    './src/atlas_sprite_sheet_player.js',
    './src/atlas_stats.js',
    './src/atlas_viewer_configuration.js'*/
const common = {
  entry: './src/atlas_main.js',
  output: {
    library: 'PixelSquidAtlas',
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
