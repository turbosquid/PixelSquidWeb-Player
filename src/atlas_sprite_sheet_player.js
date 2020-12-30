var AtlasControlAdapter = require('./atlas_control_adapter').AtlasControlAdapter;
var AtlasSphere = require('./atlas_sphere').AtlasSphere;
var AtlasSpriteSheetControls = require('./atlas_sprite_sheet_controls').AtlasSpriteSheetControls;
var AtlasImageWithProgress = require('./atlas_image_with_progress').AtlasImageWithProgress;

function AtlasSpriteSheetPlayer(configuration) {
  this.VERSION = '<!-- @version -->';
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

  function configFetch(name, defaultValue) {
    return (name in configuration) ? configuration[name] : defaultValue;
  }

  // added for testing
  this._transport            = configuration.transport

  this._elemControlArea      = configFetch('controlArea', '.atlas-control-area');
  this._elemViewer           = configFetch('viewer', '.atlas-viewer');
  this._elemEvents           = configFetch('events', '.atlas-events');
  this._windowSize           = configFetch('windowSize', 600);
  this._forceBackground      = configFetch('forceBackground', false);
  this._preferredImageSize   = configFetch('preferredImageSize', 600);
  this._elemParent           = configFetch('parent', '.atlas-events');
  this._useCanvas            = configFetch('useCanvas', true);
  this._useCanvasTranslation = configFetch('useCanvasTranslation', true);
  this._useImageSmoothing    = configFetch('useImageSmoothing', false);
  this._$                    = configuration.jquery;
  this._applyStyles          = configFetch('applyStyles', false);
  this._atlasControlAdapter  = new AtlasControlAdapter(configuration.jquery);
  this._atlasControls        = new AtlasSpriteSheetControls(this._elemParent,
                                                            this._elemControlArea,
                                                            this._atlasControlAdapter,
                                                            configuration.jquery);
  this._canvas           = null;
  this._context          = null;
  this._div              = null;
  this._url              = null;
  this._imageResolution  = 0;
  this._canvasResolution = 0;
  this._loadComplete     = false;
  this._cssBackgroundSet = false

  var that = this;
  if (this._$) {
    this._$(this._elemControlArea).on('change', function(evt, data) {
      that._onControlAreaChange(evt, data);
    });
  }
  else {
    this.addEventListener(this._elemControlArea, 'change', function(evt) {
      var data = { horizontal: evt.horizontal, vertical: evt.vertical };

      if (typeof evt.detail !== 'undefined') {
        data.horizontal = evt.detail.horizontal
        data.vertical = evt.detail.vertical
      }

      that._onControlAreaChange(evt, data);
    }, false);
  }
}

AtlasSpriteSheetPlayer.prototype._onControlAreaChange = function(evt, data) {
  var horizontal, vertical;

  if (typeof evt.originalEvent !== 'undefined') {
    horizontal = evt.originalEvent.horizontal;
    vertical   = evt.originalEvent.vertical;
  }

  if (typeof data !== 'undefined') {
    horizontal = data.horizontal;
    vertical   = data.vertical;
  }

  horizontal = horizontal || evt.horizontal || 0;
  vertical   = vertical || evt.vertical || 0;

  this.rotate(horizontal, vertical);
};

AtlasSpriteSheetPlayer.prototype.addEventListener = function(elem, event, callback) {
  var element = document.querySelectorAll(elem);
  if (element && element.length) {
    element[0].addEventListener(event, callback, false);
  }
};

AtlasSpriteSheetPlayer.prototype.triggerEvent = function(elem, event, data) {
  if (this._$) {
    this._$(elem).trigger(event, [data]);
  }
  else {
    var element = document.querySelectorAll(elem);
    if (element && element.length) {
      if (typeof CustomEvent !== 'undefined') {
        element[0].dispatchEvent(new CustomEvent(event, { 'detail': data }));
        return
      }

      if (typeof document.createEvent !== 'undefined') {
        var eventObject = document.createEvent('Event');
        eventObject.initEvent(event, true, true);
        eventObject.detail = data;
        element[0].dispatchEvent(eventObject);
        return
      }

      // photoshop
      if (typeof Event !== 'undefined') {
        var eventObject = new Event(event)
        eventObject.detail = data
        element[0].dispatchEvent(eventObject)
        return
      }
    }
  }
};

AtlasSpriteSheetPlayer.prototype._getDomElement = function(elem) {
  var element = elem;
  if (typeof element !== 'object') {
    element = document.querySelectorAll(elem);
    if (element && element.length) {
      return element[0];
    }
    else {
      return null;
    }
  }

  return element;
};

AtlasSpriteSheetPlayer.prototype.resizeElement = function(elem, attrSize, styleSize) {
  var element = this._getDomElement(elem);
  if (element) {
    element.setAttribute('width', attrSize);
    element.setAttribute('height', attrSize);

    if (this._applyStyles) {
      element.style.width  = [styleSize, 'px'].join('');
      element.style.height = [styleSize, 'px'].join('');
    }
  }
};

AtlasSpriteSheetPlayer.prototype.positionElement = function(elem, left, top) {
  var element = this._getDomElement(elem);
  if (element && this._applyStyles) {
    element.style.position = 'absolute';
    element.style.top  = [top, 'px'].join('');
    element.style.left = [left, 'px'].join('');
  }
};

AtlasSpriteSheetPlayer.prototype.hide = function(elem) {
  var element = this._getDomElement(elem);
  if (element) {
    element.style.display = 'none';
  }
};

AtlasSpriteSheetPlayer.prototype.show = function(elem) {
  var element = this._getDomElement(elem);
  if (element) {
    element.style.display = 'block';
  }
};

AtlasSpriteSheetPlayer.prototype.append = function(parent, child) {
  var parentElement = this._getDomElement(parent);
  var childElement  = this._getDomElement(child);

  if (parentElement && childElement) {
    parentElement.appendChild(childElement);
  }
};

AtlasSpriteSheetPlayer.prototype.remove = function(parent, child) {
  var parentElement = this._getDomElement(parent);
  var childElement  = this._getDomElement(child);

  if (parentElement && childElement) {
    parentElement.removeChild(childElement);
  }
}

let wasLoaded = false

AtlasSpriteSheetPlayer.prototype.renderCssCell = function(cell) {
  var element = this._getDomElement(this._div);
  if (element) {
    if (this._applyStyles) {
      element.style.width  = this._windowSize;
      element.style.height = this._windowSize;
    }

    if (!this._cssBackgroundSet) {
      element.style['background-image']    = ['url("', this._url, '")'].join('');
      element.style['background-repeat']   = 'no-repeat'
      element.style['background-size']     = [16 * this._imageResolution * this._backgroundScale, 'px ', this._latitudesForSize * this._imageResolution * this._backgroundScale, 'px'].join('');
      this._cssBackgroundSet = true
    }

    element.style['background-position'] = ['-', cell.left * this._backgroundScale, 'px -', cell.top * this._backgroundScale, 'px'].join('');
  }
};

AtlasSpriteSheetPlayer.prototype.adjustValidLatitudes = function (cameraType) {
  if (cameraType === 'top_half' || cameraType === 'half_spinner') {
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
  var latitude       = this._currentImage.substring(0, 1);
  var longitude      = this._currentImage.substring(1);
  var latitudeIndex  = this._validLatitudes.indexOf(latitude);
  var longitudeIndex = this._validLongitudes.indexOf(longitude);

  latitudeIndex  += vertical;
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
  this.triggerEvent(this._elemEvents, 'atlas-image-changed', { currentImage: this._currentImage, nextImage: imageIndex });
  this.setNextImageIndex(imageIndex);
};

AtlasSpriteSheetPlayer.prototype.setNextImageIndex = function (imageIndex) {
  this._currentImage = imageIndex;
  this.renderImage();
};

AtlasSpriteSheetPlayer.prototype.createCanvas = function () {
  if (!this._useCanvas) {
    return false;
  }

  try {
    this._canvas  = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');

    if (!this._canvas || !this._context) {
      throw 'CANVAS IS NOT SUPPORTED';
    }
  } catch (e) {
    this._canvas  = null;
    this._context = null;
    return false;
  }
  var devicePixelRatio   = window.devicePixelRatio || 1;
  var backingStoreRatio  = this._context.webkitBackingStorePixelRatio || this._context.mozBackingStorePixelRatio || this._context.msBackingStorePixelRatio || this._context.oBackingStorePixelRatio || this._context.backingStorePixelRatio || 1;
  var ratio              = devicePixelRatio / backingStoreRatio;
  this._canvasResolution = ratio * this._windowSize;

  this.resizeElement(this._canvas, this._canvasResolution, this._windowSize);
  this.positionElement(this._canvas, 0, 0);
  this.hide(this._canvas);
  this.append(this._elemViewer, this._canvas);
  return true;
};

AtlasSpriteSheetPlayer.prototype.createDiv = function () {
  this._div = document.createElement('div');
  this.resizeElement(this._div, this._windowSize, this._windowSize);
  this.positionElement(this._div, 0, 0);
  this.hide(this._div);
  this.append(this._elemViewer, this._div);
};

AtlasSpriteSheetPlayer.prototype.load = function (params, callback) {
  this._assetId          = null;
  this._asset            = null;
  this._initialImage     = null;
  this._currentImage     = null;
  this._validLatitudes   = null;
  this._latitudesForSize = 0;
  this._validLongitudes  = null;
  this._imageResolution  = null;
  this._loadComplete     = false;
  this._url              = null;
  this._cssBackgroundSet = false;
  this._atlasSphere      = new AtlasSphere();

  if (typeof console !== 'undefined') {
    console.log('v' + this.VERSION);
  }
  if (!params.asset) {
    throw 'NO ASSET SPECIFIED';
  }
  if (!params.asset['sprites_600'] && !params.asset['sprites_300']) {
    throw 'ASSET NOT A SPRITE SHEET ASSET';
  }

  // a url to a local file already loaded
  this._localUrl        = params.localUrl;

  this._assetId         = params.assetId;
  this._asset           = params.asset;
  this._initialImage    = params.initialImage || params.asset.initial_image || 'H01';
  this._currentImage    = this._initialImage;
  this._validLatitudes  = this._asset.validLatitudes || this.VALID_LATITUDES;
  this._validLongitudes = this._asset.validLongitudes || this.VALID_LONGITUDES;
  this.adjustValidLatitudes(this._asset.extensions.atlas.camera_type_code || this._asset.atlas.camera_type_code);

  //this._latitudesForSize = this._validLatitudes.length
  this._latitudesForSize = 16

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
    if (!this.createCanvas()) {
      this.createDiv();
    }
  } else {
    this.createDiv();
  }

  this._atlasSphere.initPartial(this._validLatitudes, this._validLongitudes, false, this._imageResolution);
  this.triggerEvent(this._elemEvents, 'atlas-load-start');

  const imageParent = params.attachImage ? this._elemEvents : null

  this._atlasImage = new AtlasImageWithProgress(imageParent, this._transport);

  var that = this

  if (this._localUrl) {
    this._atlasImage.loadLocal(this._localUrl, function (error, progress, image, size) {
      if (size) {
        that._latitudesForSize = size.height / that._imageResolution
      }
      that.loadCallback(error, progress, image, callback)
    })
  } else {
    this._atlasImage.load(this._url, function (error, progress, image, size) {
      if (size) {
        that._latitudesForSize = size.height / that._imageResolution
      }
      that.loadCallback(error, progress, image, callback)
    })
  }
};

AtlasSpriteSheetPlayer.prototype.loadCallback = function (error, progress, image, callback) {
  if (error) {
    this.triggerEvent(this._elemEvents, 'atlas-load-error', { error: error });
    callback(error, null);
  }
  if (!image && progress < 100) {
    this.triggerEvent(this._elemEvents, 'atlas-load-progress', { progress: progress / 100 });
  }
  if (image && progress >= 100) {
    this._loadComplete = true;
    this.renderImage();

    if (this._canvas && this._context) {
      this.show(this._canvas);
    } else {
      this.show(this._div);
    }
    if (callback) {
      callback(null, image);
    }
    this.triggerEvent(this._elemEvents, 'atlas-load-interactivity');
    this.triggerEvent(this._elemEvents, 'atlas-load-complete', { image: image });
  }
}

AtlasSpriteSheetPlayer.prototype.unload = function () {
  if (this._atlasControls) {
    this._atlasControls.unload();
  }
  if (this._atlasImage) {
    this._atlasImage.unload();
  }

  this.remove(this._elemViewer, this._div);
};

AtlasSpriteSheetPlayer.prototype.cancelLoading = function () {
  if (this._atlasImage) {
    this._atlasImage.cancel();
  }
};

AtlasSpriteSheetPlayer.prototype.renderImage = function (image, forceBackground) {
  if (!this._loadComplete) {
    return;
  }

  this._currentImage = image || this._currentImage;
  var cell           = this._atlasSphere.getSphereCellForIndex(this._currentImage);

  if (this._canvas && this._context && !forceBackground && !this._forceBackground) {
    if (this._useImageSmoothing) {
      this._context.imageSmoothingEnabled    = true;
      this._context.mozImageSmoothingEnabled = true;
    }
    else {
      this._context.imageSmoothingEnabled    = false;
      this._context.mozImageSmoothingEnabled = false;
    }

    if (this._useCanvasTranslation) {
      // This fixes an issue with Android downsampling images > 4096x4096
      // causing various problems with drawImage and background-position
      this._context.save();
      var drawScale = this._canvasResolution / this._imageResolution;
      this._context.scale(drawScale, drawScale);
      this._context.translate(-cell.left, -cell.top);
      this._context.drawImage(this._atlasImage.image, 0, 0);
      this._context.restore();
    } else {
      this._context.drawImage(this._atlasImage.image, cell.left, cell.top, this._imageResolution, this._imageResolution, 0, 0, this._canvasResolution, this._canvasResolution);
    }
  } else {
    this.renderCssCell(cell);
  }
};

AtlasSpriteSheetPlayer.prototype.getCurrentImageIndex = function () {
  return this._currentImage;
};

AtlasSpriteSheetPlayer.prototype.isCanvasRender = function () {
  return this._canvas && this._context;
};

AtlasSpriteSheetPlayer.prototype.resizeWindow = function (windowSize) {
  this._windowSize       = windowSize;
  this._backgroundScale  = this._windowSize / this._imageResolution;

  var devicePixelRatio   = window.devicePixelRatio || 1;
  var backingStoreRatio  = this._context.webkitBackingStorePixelRatio || this._context.mozBackingStorePixelRatio || this._context.msBackingStorePixelRatio || this._context.oBackingStorePixelRatio || this._context.backingStorePixelRatio || 1;
  var ratio              = devicePixelRatio / backingStoreRatio;
  this._canvasResolution = ratio * this._windowSize;

  if (this.isCanvasRender()) {
    this.resizeElement(this._canvas, this._canvasResolution, this._windowSize);
  }
  else {
    this.resizeElement(this._div, this._windowSize, this._windowSize);
  }

  this.renderImage(this._currentImage, false);
}

exports.AtlasSpriteSheetPlayer = AtlasSpriteSheetPlayer;
