'use strict';

var usjs = _.noConflict();

function AtlasAvailableDownloadFormats() {
  this._asset = null;
  this._formats = {};
}

AtlasAvailableDownloadFormats.prototype.getDownloadFormatsForView = function (view) {
  if (!this._formats[view]) {
    return [];
  }
  return this._formats[view];
};

AtlasAvailableDownloadFormats.prototype.getDownloadFormatsForViewAndFormat = function (view, format) {
  if (!this._formats[view]) {
    return [];
  }
  return usjs.filter(this._formats[view], function (item) {
    return item.format === format;
  });
};

AtlasAvailableDownloadFormats.prototype.getDownloadFormatsForViewFormatAndResolution = function (view, format, resolution) {
  if (!this._formats[view]) {
    return [];
  }
  return usjs.find(this._formats[view], function (item) {
    return item.format === format && item.resolution === resolution;
  });
};

AtlasAvailableDownloadFormats.prototype.parseAsset = function (asset) {
  this._asset = asset;
  this._formats = {};
  if (!this._asset.extensions || !this._asset.extensions.atlas || !this._asset.extensions.atlas.indexes) {
    return false;
  }
  usjs.each(this._asset.extensions.atlas.indexes, function (index) {
    usjs.each(usjs.keys(index.index), function (view) {
      var s = index.index[view];
      var status = 'not_available';
      switch (s) {
        case 0:
          status = 'not_available';
        break;
        case 1:
          status = 'available';
        break;
        case 2:
          status = 'on_demand';
        break;
      }
      var availableFormats = this._formats[view];
      if (!availableFormats) {
        availableFormats = [];
        this._formats[view] = availableFormats;
      }
      var format = {
        format: index.format,
        resolution: index.resolution,
        status: status
      };
      availableFormats.push(format);
    }, this);
  }, this);
  return true;
};

exports.AtlasAvailableDownloadFormats = AtlasAvailableDownloadFormats;
