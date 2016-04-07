var AtlasControlAdapter = require('./atlas_control_adapter').AtlasControlAdapter;
var AtlasSphere = require('./atlas_sphere').AtlasSphere;
var AtlasSpriteSheetControls = require('./atlas_sprite_sheet_controls').AtlasSpriteSheetControls;
var AtlasImageWithProgress = require('./atlas_image_with_progress').AtlasImageWithProgress;
var AtlasAvailableDownloadFormats = require('./atlas_available_download_formats').AtlasAvailableDownloadFormats;

function AtlasSpriteSheetPlayer(configuration) {
  this.VERSION = '1.2.2';
  this.VALID_LATITUDES = [
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O'
  ];
  this.VALID_LONGITUDES = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16'
  ];
  this._elemControlArea = configuration.controlArea || '.atlas-control-area';
  this._elemViewer = configuration.viewer || '.atlas-viewer';
  this._elemEvents = configuration.events || '.atlas-events';
  this._windowSize = configuration.windowSize || 600;
  this._forceBackground = configuration.forceBackground || false;
  this._preferredImageSize = configuration.preferredImageSize || 600;
  this._elemParent = configuration.parent || '.atlas-events';
  this._atlasControlAdapter = new AtlasControlAdapter();
  this._atlasControls = new AtlasSpriteSheetControls(this._elemParent, this._elemControlArea, this._atlasControlAdapter);
  this._useCanvas = configuration.useCanvas === undefined ? true : configuration.useCanvas;
  this._canvas = null;
  this._context = null;
  this._div = null;
  this._url = null;
  this._imageResolution = 0;
  this._canvasResolution = 0;
  var that = this;
  $(this._elemControlArea).on('change', function (evt, data) {
    var horizontal, vertical;
    if (typeof data !== 'undefined') {
      horizontal = data.horizontal;
      vertical = data.vertical;
    }
    horizontal = horizontal || evt.horizontal || evt.originalEvent.horizontal;
    vertical = vertical || evt.vertical || evt.originalEvent.vertical;
    that.rotate(horizontal, vertical);
  });
}
AtlasSpriteSheetPlayer.prototype.adjustValidLatitudes = function (cameraType) {
  if (cameraType === 'top_half') {
    this._validLatitudes = [
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I'
    ];
  }
};
AtlasSpriteSheetPlayer.prototype.rotate = function (horizontal, vertical) {
  if (!this._currentImage) {
    return;
  }
  var latitude = this._currentImage.substring(0, 1);
  var longitude = this._currentImage.substring(1);
  var latitudeIndex = this._validLatitudes.indexOf(latitude);
  var longitudeIndex = this._validLongitudes.indexOf(longitude);
  latitudeIndex += vertical;
  longitudeIndex += horizontal % this._atlasSphere._longitudes;
  if (latitudeIndex < 0) {
    latitudeIndex = 0;
  } else if (latitudeIndex >= this._atlasSphere._latitudes) {
    latitudeIndex = this._atlasSphere._latitudes - 1;
  }
  if (longitudeIndex < 0) {
    longitudeIndex += this._atlasSphere._longitudes;
  } else if (longitudeIndex >= this._atlasSphere._longitudes) {
    longitudeIndex -= this._atlasSphere._longitudes;
  }
  var imageIndex = this._validLatitudes[latitudeIndex] + this._validLongitudes[longitudeIndex];
  $(this._elemEvents).trigger('atlas-image-changed', [{
    currentImage: this._currentImage,
    nextImage: imageIndex
  }]);
  this.setNextImageIndex(imageIndex);
};
AtlasSpriteSheetPlayer.prototype.setNextImageIndex = function (imageIndex) {
  this._currentImage = imageIndex;
  this.renderImage();
};
AtlasSpriteSheetPlayer.prototype.createCanvas = function () {
  try {
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    if (!this._canvas || !this._context) {
      throw 'CANVAS IS NOT SUPPORTED';
    }
  } catch (e) {
    this._canvas = null;
    this._context = null;
    return false;
  }
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = this._context.webkitBackingStorePixelRatio || this._context.mozBackingStorePixelRatio || this._context.msBackingStorePixelRatio || this._context.oBackingStorePixelRatio || this._context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;
  this._canvasResolution = ratio * this._windowSize;
  var c = $(this._canvas);
  c.attr('width', this._canvasResolution);
  c.attr('height', this._canvasResolution);
  c.css('width', [
    this._windowSize,
    'px'
  ].join(''));
  c.css('height', [
    this._windowSize,
    'px'
  ].join(''));
  c.css('position', 'absolute');
  c.css('top', '0px');
  c.css('left', '0px');
  c.hide();
  $(this._elemViewer).append(this._canvas);
  return true;
};
AtlasSpriteSheetPlayer.prototype.createDiv = function () {
  this._div = document.createElement('div');
  var d = $(this._div);
  d.attr('width', this._windowSize);
  d.attr('height', this._windowSize);
  d.css('width', [
    this._windowSize,
    'px'
  ].join(''));
  d.css('height', [
    this._windowSize,
    'px'
  ].join(''));
  d.css('position', 'absolute');
  d.css('top', '0px');
  d.css('left', '0px');
  d.hide();
  $(this._elemViewer).append(this._div);
};
AtlasSpriteSheetPlayer.prototype.load = function (params, callback) {
  this._assetId = null;
  this._asset = null;
  this._initialImage = null;
  this._currentImage = null;
  this._validLatitudes = null;
  this._validLongitudes = null;
  this._imageResolution = null;
  this._url = null;
  this._atlasSphere = new AtlasSphere();
  this._atlasImage = new AtlasImageWithProgress();
  this._downloadFormats = new AtlasAvailableDownloadFormats();
  if (typeof console !== 'undefined') {
    console.log('v' + this.VERSION);
  }
  if (!params.asset) {
    throw 'NO ASSET SPECIFIED';
  }
  if (!params.asset['sprites_600'] && !params.asset['sprites_300']) {
    throw 'ASSET NOT A SPRITE SHEET ASSET';
  }
  this._assetId = params.assetId;
  this._asset = params.asset;
  this._initialImage = params.initialImage || 'H01';
  this._currentImage = this._initialImage;
  this._validLatitudes = this._asset.validLatitudes || this.VALID_LATITUDES;
  this._validLongitudes = this._asset.validLongitudes || this.VALID_LONGITUDES;
  this.adjustValidLatitudes(this._asset.extensions.atlas.camera_type_code || this._asset.atlas.camera_type_code);
  var preferredKey = 'sprites_' + this._preferredImageSize;
  if (this._asset[preferredKey]) {
    this._imageResolution = this._preferredImageSize;
    this._url = this._asset[preferredKey];
  }
  if (!this._url) {
    this._imageResolution = 600;
    this._url = this._asset['sprites_600'];
    if (!this._url) {
      this._imageResolution = 300;
      this._url = this._asset['sprites_300'];
    }
  }
  this._backgroundScale = 1;
  this._backgroundScale = this._windowSize / this._imageResolution;
  if (!this._forceBackground) {
    this.createCanvas();
  } else {
    this.createDiv();
  }
  this._atlasSphere.initPartial(this._validLatitudes, this._validLongitudes, false, this._imageResolution);
  this._downloadFormats.parseAsset(this._asset);
  $(this._elemEvents).trigger('atlas-load-start');
  var that = this;
  this._atlasImage.load(this._url, function (error, progress, image) {
    if (error) {
      $(that._elemEvents).trigger('atlas-load-error', [{ error: error }]);
      callback(error, null);
    }
    if (!image && progress < 100) {
      $(that._elemEvents).trigger('atlas-load-progress', [{ progress: progress / 100 }]);
    }
    if (image && progress >= 100) {
      that.renderImage();
      var update = setInterval(function () {
        that.renderImage();
      }, 100);
      setTimeout(function () {
        clearInterval(update);
      }, 1000);
      if (that._canvas && that._context) {
        $(that._canvas).show();
      } else {
        $(that._div).show();
      }
      if (callback) {
        callback(null, image);
      }
      $(that._elemEvents).trigger('atlas-load-interactivity');
      $(that._elemEvents).trigger('atlas-load-complete', [{ image: image }]);
    }
  });
};

AtlasSpriteSheetPlayer.prototype.renderImage = function (image, forceBackground) {
  this._currentImage = image || this._currentImage;
  var cell = this._atlasSphere.getSphereCellForIndex(this._currentImage);
  if (this._canvas && this._context && !forceBackground && !this._forceBackground) {
    this._context.imageSmoothingEnabled = true;
    this._context.mozImageSmoothingEnabled = true;
    this._context.drawImage(this._atlasImage.image, cell.left, cell.top, this._imageResolution, this._imageResolution, 0, 0, this._canvasResolution, this._canvasResolution);
  } else {
    var css = {
      'width': this._windowSize,
      'height': this._windowSize,
      'background-image': [
        'url("',
        this._url,
        '")'
      ].join(''),
      'background-position': [
        '-',
        cell.left * this._backgroundScale,
        'px -',
        cell.top * this._backgroundScale,
        'px'
      ].join(''),
      'background-size': [
        16 * this._imageResolution * this._backgroundScale,
        'px ',
        this._validLatitudes.length * this._imageResolution * this._backgroundScale,
        'px'
      ].join('')
    };
    $(this._div).css(css);
  }
};

AtlasSpriteSheetPlayer.prototype.getDownloadFormatsForView = function (view) {
  return this._downloadFormats.getDownloadFormatsForView(view);
};

AtlasSpriteSheetPlayer.prototype.getCurrentImageIndex = function () {
  return this._currentImage;
};

AtlasSpriteSheetPlayer.prototype.isCanvasRender = function () {
  return this._canvas && this._context;
};

exports.AtlasSpriteSheetPlayer = AtlasSpriteSheetPlayer;
