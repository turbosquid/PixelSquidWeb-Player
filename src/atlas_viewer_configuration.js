'use strict';
var Constants = require('./atlas_constants').AtlasViewerConstants;

var AtlasViewerConfiguration = function (viewerId, controlId, dragId, hideCursor) {
  this._viewerId = viewerId;
  this._controlId = controlId;
  this._dragId = dragId;
  this._hideCursor = hideCursor;
  this._thresholdType = Constants.THRESHOLD_ADAPTIVE;
  this._staticThreshold = 50;
  this._adaptiveThreshold = 0.85;
  this._initialImageIndex = 'G05';
};

exports.AtlasViewerConfiguration = AtlasViewerConfiguration;
