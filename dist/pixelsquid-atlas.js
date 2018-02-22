(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PixelSquid"] = factory();
	else
		root["PixelSquid"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var AtlasSpriteSheetPlayer = __webpack_require__(1).AtlasSpriteSheetPlayer;
	var AtlasAPIAdapter = __webpack_require__(7).AtlasAPIAdapter;
	var AtlasSPAdapter = __webpack_require__(8).AtlasSPAdapter;

	exports.AtlasSpriteSheetPlayer = AtlasSpriteSheetPlayer;
	exports.AtlasAPIAdapter = AtlasAPIAdapter;
	exports.AtlasSPAdapter = AtlasSPAdapter;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var AtlasControlAdapter = __webpack_require__(2).AtlasControlAdapter;
	var AtlasSphere = __webpack_require__(4).AtlasSphere;
	var AtlasSpriteSheetControls = __webpack_require__(5).AtlasSpriteSheetControls;
	var AtlasImageWithProgress = __webpack_require__(6).AtlasImageWithProgress;

	function AtlasSpriteSheetPlayer(configuration) {
	  this.VERSION = '2.4.3';
	  this.VALID_LATITUDES = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
	  this.VALID_LONGITUDES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'];

	  function configFetch(name, defaultValue) {
	    return name in configuration ? configuration[name] : defaultValue;
	  }

	  this._elemControlArea = configFetch('controlArea', '.atlas-control-area');
	  this._elemViewer = configFetch('viewer', '.atlas-viewer');
	  this._elemEvents = configFetch('events', '.atlas-events');
	  this._windowSize = configFetch('windowSize', 600);
	  this._forceBackground = configFetch('forceBackground', false);
	  this._preferredImageSize = configFetch('preferredImageSize', 600);
	  this._elemParent = configFetch('parent', '.atlas-events');
	  this._useCanvas = configFetch('useCanvas', true);
	  this._useCanvasTranslation = configFetch('useCanvasTranslation', true);
	  this._useImageSmoothing = configFetch('useImageSmoothing', false);
	  this._$ = configuration.jquery;
	  this._applyStyles = configFetch('applyStyles', false);
	  this._atlasControlAdapter = new AtlasControlAdapter(configuration.jquery);
	  this._atlasControls = new AtlasSpriteSheetControls(this._elemParent, this._elemControlArea, this._atlasControlAdapter, configuration.jquery);
	  this._canvas = null;
	  this._context = null;
	  this._div = null;
	  this._url = null;
	  this._imageResolution = 0;
	  this._canvasResolution = 0;
	  this._loadComplete = false;

	  var that = this;
	  if (this._$) {
	    this._$(this._elemControlArea).on('change', function (evt, data) {
	      that._onControlAreaChange(evt, data);
	    });
	  } else {
	    this.addEventListener(this._elemControlArea, 'change', function (evt) {
	      var data = { horizontal: evt.horizontal, vertical: evt.vertical };
	      that._onControlAreaChange(evt, data);
	    }, false);
	  }
	}

	AtlasSpriteSheetPlayer.prototype._onControlAreaChange = function (evt, data) {
	  var horizontal, vertical;

	  if (typeof evt.originalEvent !== 'undefined') {
	    horizontal = evt.originalEvent.horizontal;
	    vertical = evt.originalEvent.vertical;
	  }
	  if (typeof data !== 'undefined') {
	    horizontal = data.horizontal;
	    vertical = data.vertical;
	  }
	  horizontal = horizontal || evt.horizontal || 0;
	  vertical = vertical || evt.vertical || 0;

	  this.rotate(horizontal, vertical);
	};

	AtlasSpriteSheetPlayer.prototype.addEventListener = function (elem, event, callback) {
	  var element = document.querySelectorAll(elem);
	  if (element && element.length) {
	    element[0].addEventListener(event, callback, false);
	  }
	};

	AtlasSpriteSheetPlayer.prototype.triggerEvent = function (elem, event, data) {
	  if (this._$) {
	    this._$(elem).trigger(event, [data]);
	  } else {
	    var element = document.querySelectorAll(elem);
	    if (element && element.length) {
	      if (typeof CustomEvent === 'undefined') {
	        var eventObject = document.createEvent('Event');
	        eventObject.initEvent(event, true, true);
	        eventObject.detail = data;
	        element[0].dispatchEvent(eventObject);
	      } else {
	        element[0].dispatchEvent(new CustomEvent(event, { 'detail': data }));
	      }
	    }
	  }
	};

	AtlasSpriteSheetPlayer.prototype._getDomElement = function (elem) {
	  var element = elem;
	  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
	    element = document.querySelectorAll(elem);
	    if (element && element.length) {
	      return element[0];
	    } else {
	      return null;
	    }
	  }

	  return element;
	};

	AtlasSpriteSheetPlayer.prototype.resizeElement = function (elem, attrSize, styleSize) {
	  var element = this._getDomElement(elem);
	  if (element) {
	    element.setAttribute('width', attrSize);
	    element.setAttribute('height', attrSize);

	    if (this._applyStyles) {
	      element.style.width = [styleSize, 'px'].join('');
	      element.style.height = [styleSize, 'px'].join('');
	    }
	  }
	};

	AtlasSpriteSheetPlayer.prototype.positionElement = function (elem, left, top) {
	  var element = this._getDomElement(elem);
	  if (element && this._applyStyles) {
	    element.style.position = 'absolute';
	    element.style.top = [top, 'px'].join('');
	    element.style.left = [left, 'px'].join('');
	  }
	};

	AtlasSpriteSheetPlayer.prototype.hide = function (elem) {
	  var element = this._getDomElement(elem);
	  if (element) {
	    element.style.display = 'none';
	  }
	};

	AtlasSpriteSheetPlayer.prototype.show = function (elem) {
	  var element = this._getDomElement(elem);
	  if (element) {
	    element.style.display = 'block';
	  }
	};

	AtlasSpriteSheetPlayer.prototype.append = function (parent, child) {
	  var parentElement = this._getDomElement(parent);
	  var childElement = this._getDomElement(child);

	  if (parentElement && childElement) {
	    parentElement.appendChild(childElement);
	  }
	};

	AtlasSpriteSheetPlayer.prototype.renderCssCell = function (cell) {
	  var element = this._getDomElement(this._div);
	  if (element) {
	    if (this._applyStyles) {
	      element.style.width = this._windowSize;
	      element.style.height = this._windowSize;
	    }

	    element.style['background-image'] = ['url("', this._url, '")'].join('');
	    element.style['background-position'] = ['-', cell.left * this._backgroundScale, 'px -', cell.top * this._backgroundScale, 'px'].join('');
	    element.style['background-size'] = [16 * this._imageResolution * this._backgroundScale, 'px ', this._validLatitudes.length * this._imageResolution * this._backgroundScale, 'px'].join('');
	  }
	};

	AtlasSpriteSheetPlayer.prototype.adjustValidLatitudes = function (cameraType) {
	  if (cameraType === 'top_half') {
	    this._validLatitudes = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
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
	  this._assetId = null;
	  this._asset = null;
	  this._initialImage = null;
	  this._currentImage = null;
	  this._validLatitudes = null;
	  this._validLongitudes = null;
	  this._imageResolution = null;
	  this._loadComplete = false;
	  this._url = null;
	  this._atlasSphere = new AtlasSphere();
	  this._atlasImage = new AtlasImageWithProgress();

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
	  this._initialImage = params.initialImage || params.asset.initial_image || 'H01';
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
	    if (!this.createCanvas()) {
	      this.createDiv();
	    }
	  } else {
	    this.createDiv();
	  }
	  this._atlasSphere.initPartial(this._validLatitudes, this._validLongitudes, false, this._imageResolution);
	  this.triggerEvent(this._elemEvents, 'atlas-load-start');
	  var that = this;
	  this._atlasImage.load(this._url, function (error, progress, image) {
	    if (error) {
	      that.triggerEvent(that._elemEvents, 'atlas-load-error', { error: error });
	      callback(error, null);
	    }
	    if (!image && progress < 100) {
	      that.triggerEvent(that._elemEvents, 'atlas-load-progress', { progress: progress / 100 });
	    }
	    if (image && progress >= 100) {
	      that._loadComplete = true;
	      that.renderImage();

	      if (that._canvas && that._context) {
	        that.show(that._canvas);
	      } else {
	        that.show(that._div);
	      }
	      if (callback) {
	        callback(null, image);
	      }
	      that.triggerEvent(that._elemEvents, 'atlas-load-interactivity');
	      that.triggerEvent(that._elemEvents, 'atlas-load-complete', { image: image });
	    }
	  });
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
	  var cell = this._atlasSphere.getSphereCellForIndex(this._currentImage);

	  if (this._canvas && this._context && !forceBackground && !this._forceBackground) {
	    if (this._useImageSmoothing) {
	      this._context.imageSmoothingEnabled = true;
	      this._context.mozImageSmoothingEnabled = true;
	    } else {
	      this._context.imageSmoothingEnabled = false;
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
	  this._windowSize = windowSize;
	  this._backgroundScale = this._windowSize / this._imageResolution;

	  var devicePixelRatio = window.devicePixelRatio || 1;
	  var backingStoreRatio = this._context.webkitBackingStorePixelRatio || this._context.mozBackingStorePixelRatio || this._context.msBackingStorePixelRatio || this._context.oBackingStorePixelRatio || this._context.backingStorePixelRatio || 1;
	  var ratio = devicePixelRatio / backingStoreRatio;
	  this._canvasResolution = ratio * this._windowSize;

	  if (this.isCanvasRender()) {
	    this.resizeElement(this._canvas, this._canvasResolution, this._windowSize);
	  } else {
	    this.resizeElement(this._div, this._windowSize, this._windowSize);
	  }

	  this.renderImage(this._currentImage, false);
	};

	exports.AtlasSpriteSheetPlayer = AtlasSpriteSheetPlayer;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AtlasClientCapabilities = __webpack_require__(3).AtlasClientCapabilities;

	exports.AtlasControlAdapter = function (jquery) {
	  this._dragging = false;
	  this._domElement = null;
	  this._cellWidthInPixels = 10;
	  this._cellHeightInPixels = 10;
	  this._$ = jquery;

	  if (AtlasClientCapabilities.getCapabilities().isRetinaCapable) {
	    this._cellWidthInPixels /= 2;
	    this._cellHeightInPixels /= 2;
	  }

	  this._changeEvent = { type: 'change' };
	  this._mouseDown = {
	    x: -1,
	    y: -1
	  };

	  this._positionInCell = {
	    x: this._cellWidthInPixels / 2,
	    y: this._cellHeightInPixels / 2
	  };

	  this._nextPositionInCell = {
	    x: 0,
	    y: 0
	  };

	  this.reset = function () {
	    this._positionInCell.x = this._cellWidthInPixels / 2;
	    this._positionInCell.y = this._cellHeightInPixels / 2;
	  };

	  this.begin = function (x, y) {
	    this._dragging = true;
	    this._mouseDown.x = x;
	    this._mouseDown.y = y;
	  };

	  this.end = function (x, y) {
	    if (!this._dragging) {
	      return;
	    }
	    this._dragging = false;
	    var delta = {
	      dx: x - this._mouseDown.x,
	      dy: y - this._mouseDown.y
	    };
	    this._nextPositionInCell.x = this._positionInCell.x + delta.dx;
	    this._nextPositionInCell.y = this._positionInCell.y + delta.dy;
	    var horizontal = 0;
	    if (this._nextPositionInCell.x > this._cellWidthInPixels) {
	      horizontal = Math.floor(this._nextPositionInCell.x / this._cellWidthInPixels);
	      this._positionInCell.x = this._nextPositionInCell.x - horizontal * this._cellWidthInPixels;
	    } else if (this._nextPositionInCell.x < 0) {
	      horizontal = -1 + Math.ceil(this._nextPositionInCell.x / this._cellWidthInPixels);
	      this._positionInCell.x = this._cellWidthInPixels + this._nextPositionInCell.x % this._cellWidthInPixels;
	    } else {
	      this._positionInCell.x = this._nextPositionInCell.x;
	    }
	    horizontal *= -1;
	    var vertical = 0;
	    if (this._nextPositionInCell.y > this._cellHeightInPixels) {
	      vertical = -1;
	      this._positionInCell.y = this._nextPositionInCell.y - this._cellHeightInPixels;
	    } else if (this._nextPositionInCell.y < 0) {
	      vertical = 1;
	      this._positionInCell.y = this._cellHeightInPixels + this._nextPositionInCell.y;
	    } else {
	      this._positionInCell.y = this._nextPositionInCell.y;
	    }
	    if (this._domElement && (Math.abs(horizontal) > 0 || Math.abs(vertical) > 0)) {
	      if (this._$) {
	        this._$(this._domElement).trigger(this._changeEvent.type, [{ horizontal: horizontal, vertical: vertical }]);
	      } else {
	        var event = document.createEvent('Event');
	        event.initEvent(this._changeEvent.type, true, true);
	        event.horizontal = horizontal;
	        event.vertical = vertical;
	        this._domElement.dispatchEvent(event);
	      }
	    }
	  };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var AtlasClientCapabilities = function AtlasClientCapabilities() {
	  this._capabilities = {
	    allowInteractivity: true,
	    canvasAvailable: false,
	    renderToCanvas: false,
	    eventListener: true,
	    jqueryEvents: false,
	    jqueryAvailable: false,
	    isRetina: false,
	    isRetinaCapable: false,
	    windowDimensions: {
	      width: 300,
	      height: 300
	    },
	    resolution: '600',
	    format: 'jpeg',
	    imagePreferences: [{
	      resolution: '600',
	      format: 'jpeg'
	    }],
	    loadingSequence: null,
	    latitudeSubset: null,
	    loadConfigurator: true,
	    loadingBailouts: [],
	    forceRefreshDuration: 0
	  };
	  var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
	  var chrome = navigator.userAgent.toLowerCase().indexOf('crios') > -1 || navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	  this._capabilities.allowInteractivity = !(!!window.ActiveXObject && !window.XMLHttpRequest);
	  var elem = document.createElement('canvas');
	  this._capabilities.canvasAvailable = !!(elem.getContext && elem.getContext('2d'));
	  this._capabilities.eventListener = document.addEventListener !== undefined;
	  if (!this._capabilities.eventListener) {
	    this._capabilities.jqueryEvents = typeof jQuery !== 'undefined';
	  }
	  this._capabilities.jqueryAvailable = typeof jQuery !== 'undefined';
	  this._capabilities.isRetina = window.devicePixelRatio > 1;
	  this._capabilities.isRetinaCapable = window.devicePixelRatio > 1;
	  if (this._capabilities.canvasAvailable) {
	    this._capabilities.renderToCanvas = true;
	  }
	  if (iOS && chrome) {
	    this._capabilities.renderToCanvas = true;
	  }
	  this._capabilities.isChromeiOS = iOS && chrome;
	  this._refreshImagePreferences();
	};
	AtlasClientCapabilities.getInstance = function () {
	  if (!AtlasClientCapabilities.instance) {
	    AtlasClientCapabilities.instance = new AtlasClientCapabilities();
	  }
	  return AtlasClientCapabilities.instance;
	};
	AtlasClientCapabilities.getCapabilities = function () {
	  return AtlasClientCapabilities.getInstance()._capabilities;
	};
	AtlasClientCapabilities.mergeCapabilities = function (newCapabilities) {
	  function merge(newValue, currentValue) {
	    return newValue || currentValue;
	  }
	  var capabilities = this.getCapabilities();
	  capabilities.allowInteractivity = merge(newCapabilities.allowInteractivity, capabilities.allowInteractivity);
	  capabilities.renderToCanvas = merge(newCapabilities.renderToCanvas, capabilities.renderToCanvas);
	  capabilities.isRetina = merge(newCapabilities.isRetina, capabilities.isRetina);
	  capabilities.windowDimensions = merge(newCapabilities.windowDimensions, capabilities.windowDimensions);
	  capabilities.resolution = merge(newCapabilities.resolution, capabilities.resolution);
	  capabilities.format = merge(newCapabilities.format, capabilities.format);
	  capabilities.loadingSequence = merge(newCapabilities.loadingSequence, capabilities.loadingSequence);
	  capabilities.latitudeSubset = merge(newCapabilities.latitudeSubset, capabilities.latitudeSubset);
	  capabilities.loadingBailouts = merge(newCapabilities.loadingBailouts, capabilities.loadingBailouts);
	  return capabilities;
	};
	AtlasClientCapabilities.refreshImagePreferences = function () {
	  var capabilities = AtlasClientCapabilities.getInstance();
	  capabilities._refreshImagePreferences();
	  return capabilities._capabilities;
	};
	AtlasClientCapabilities.prototype._refreshImagePreferences = function () {
	  if (this._capabilities.imagePreferences) {
	    return;
	  }
	  if (this._capabilities.isRetina) {
	    if (this._capabilities.windowDimensions.width === 600) {
	      this._capabilities.imagePreferences = [{
	        resolution: '2k',
	        format: 'jpeg'
	      }, {
	        resolution: '600',
	        format: 'jpeg'
	      }, {
	        resolution: '300',
	        format: 'jpeg'
	      }];
	    } else if (this._capabilities.windowDimensions.width === 300) {
	      this._capabilities.imagePreferences = [{
	        resolution: '600',
	        format: 'jpeg'
	      }, {
	        resolution: '300',
	        format: 'jpeg'
	      }, {
	        resolution: '2k',
	        format: 'jpeg'
	      }];
	    }
	  } else {
	    if (this._capabilities.windowDimensions.width === 600) {
	      this._capabilities.imagePreferences = [{
	        resolution: '600',
	        format: 'jpeg'
	      }, {
	        resolution: '300',
	        format: 'jpeg'
	      }, {
	        resolution: '2k',
	        format: 'jpeg'
	      }];
	    } else if (this._capabilities.windowDimensions.width === 300) {
	      this._capabilities.imagePreferences = [{
	        resolution: '300',
	        format: 'jpeg'
	      }, {
	        resolution: '600',
	        format: 'jpeg'
	      }, {
	        resolution: '2k',
	        format: 'jpeg'
	      }];
	    }
	  }
	};

	exports.AtlasClientCapabilities = AtlasClientCapabilities;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var AtlasSphere = function AtlasSphere() {
	  this._latitudes = 0;
	  this._availableLatitudes = [];
	  this._longitudes = 0;
	  this._availableLongitudes = [];
	  this._replicatePoles = false;
	  this._cellResolution = 0;
	  this._matrix = [];
	  this._faceMap = {};
	};
	AtlasSphere.prototype.init = function (latitudes, longitudes, replicatePoles, cellResolution) {
	  this._latitudes = latitudes;
	  this._longitudes = longitudes;
	  if (this._latitudes !== 16 || this._longitudes !== 16) {
	    return;
	  }
	  this._availableLatitudes = Constants.latitudeMarkers.slice(0, this._latitudes);
	  this._availableLongitudes = Constants.longitudeMarkers.slice(0, this._longitudes);
	  this._replicatePoles = replicatePoles;
	  this._cellResolution = cellResolution || 0;
	  this._constructSphere(replicatePoles);
	};
	AtlasSphere.prototype.initPartial = function (validLatitudes, validLongitudes, replicatePoles, cellResolution) {
	  this._availableLatitudes = validLatitudes.slice(0);
	  this._latitudes = validLatitudes.length;
	  this._availableLongitudes = validLongitudes.slice(0);
	  this._longitudes = validLongitudes.length;
	  this._replicatePoles = replicatePoles;
	  this._cellResolution = cellResolution || 0;
	  this._constructSphere(replicatePoles);
	};
	AtlasSphere.prototype.getUniqueSphereCellCount = function () {
	  var lats = this._replicatePoles ? this._latitudes - 2 : this._latitudes;
	  return lats * this._longitudes;
	};
	AtlasSphere.prototype.getSphereCellForIndex = function (imageIndex) {
	  var face = this._faceMap[imageIndex];
	  return this.getSphereCellForFace(face);
	};
	AtlasSphere.prototype.getSphereCellForLatLon = function (lat, lon) {
	  if (lat < this._matrix.length) {
	    if (lon < this._matrix[lat].length) {
	      return this._matrix[lat][lon];
	    }
	  }
	  return null;
	};
	AtlasSphere.prototype.getSphereCellForFace = function (face) {
	  var lat = Math.floor(face / this._longitudes);
	  var lon = face % this._longitudes;
	  return this.getSphereCellForLatLon(lat, lon);
	};
	AtlasSphere.prototype.getSphereCellCount = function () {
	  return this._latitudes * this._longitudes;
	};
	AtlasSphere.prototype.mapImageIndexToImageIndex = function (originalImageIndex, mappedImageIndex) {
	  var cell = this.getSphereCellForIndex(originalImageIndex);
	  cell.imageIndex = mappedImageIndex;
	};
	AtlasSphere.prototype.mapFaceToImageIndex = function (face, mappedImageIndex) {
	  var cell = this.getSphereCellForFace(face);
	  cell.imageIndex = mappedImageIndex;
	};
	AtlasSphere.prototype.getMappedImageIndex = function (imageIndex) {
	  var cell = this.getSphereCellForIndex(imageIndex);
	  return cell.imageIndex;
	};
	AtlasSphere.prototype._constructSphere = function (replicatePoles) {
	  var top = 0;
	  for (var lat = 0; lat < this._availableLatitudes.length; ++lat) {
	    var latitude = [];
	    var left = 0;
	    for (var lon = 0; lon < this._availableLongitudes.length; ++lon) {
	      var imageIndex = this._availableLatitudes[lat] + this._availableLongitudes[lon];
	      var originalImageIndex = imageIndex;
	      if (this._availableLatitudes.length === 16 && this._availableLongitudes.length === 16) {
	        if (replicatePoles && lat === 0) {
	          imageIndex = Constants.latitudeMarkers[lat + 1] + Constants.longitudeMarkers[lon];
	          left = 0;
	        } else if (replicatePoles && lat === this._latitudes - 1) {
	          imageIndex = Constants.latitudeMarkers[lat - 1] + Constants.longitudeMarkers[lon];
	          left = 0;
	        }
	      }
	      latitude.push({
	        face: lat * this._longitudes + lon,
	        isPole: lat === 0 || lat === this._latitudes - 1,
	        latitude: lat,
	        longitude: lon,
	        originalImageIndex: originalImageIndex,
	        imageIndex: imageIndex,
	        left: left,
	        top: top,
	        right: left + this._cellResolution,
	        bottom: top + this._cellResolution
	      });
	      this._faceMap[originalImageIndex] = lat * this._longitudes + lon;
	      left += this._cellResolution;
	    }
	    this._matrix.push(latitude);
	    top += this._cellResolution;
	  }
	};

	exports.AtlasSphere = AtlasSphere;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AtlasClientCapabilities = __webpack_require__(3).AtlasClientCapabilities;

	var AtlasSpriteSheetControls = function AtlasSpriteSheetControls(parentSelector, domSelector, controlAdapter, jquery) {

	  this._$ = jquery;
	  this._parentSelector = parentSelector;
	  this._domSelector = domSelector;

	  if (this._$) {
	    this._domElement = this._$(this._domSelector)[0];
	  } else {
	    this._domElement = document.querySelectorAll(this._domSelector)[0];
	  }

	  this._controlAdapter = controlAdapter;
	  this._windowHalfX = 300;
	  this._windowHalfY = 300;

	  this._dragEvent = {
	    type: 'canvasDrag',
	    dragStart: 'beforeDrag',
	    dragging: 'dragging',
	    dragEnd: 'finishDrag'
	  };

	  this._enabled = false;
	  this._draggin = false;
	  var scope = this;

	  var movement = {
	    horizontal: 0,
	    vertical: 0
	  };

	  var movementCopy = {
	    horizontal: 0,
	    vertical: 0
	  };

	  var touchStartEvent = window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart';
	  var touchMoveEvent = window.navigator.msPointerEnabled ? 'MSPointerMove' : 'touchmove';
	  var touchEndEvent = window.navigator.msPointerEnabled ? 'MSPointerUp' : 'touchend';
	  var touchStartEvent = window.navigator.pointerEnabled ? 'pointerdown' : touchStartEvent;
	  var touchMoveEvent = window.navigator.pointerEnabled ? 'pointermove' : touchMoveEvent;
	  var touchEndEvent = window.navigator.pointerEnabled ? 'pointerup' : touchEndEvent;

	  this._initialize = function () {
	    if (this._controlAdapter) {
	      this._controlAdapter._domElement = this._domElement;
	    }

	    if (typeof this._domElement.style.msTouchAction !== 'undefined') {
	      this._domElement.style.msTouchAction = 'none';
	    }

	    this._windowHalfX = this._domElement.clientWidth / 2;
	    this._windowHalfY = this._domElement.clientHeight / 2;

	    if (this._$) {
	      this._$(this._parentSelector).on('contextmenu.player', this._domSelector, function (e) {
	        e.preventDefault();
	      });

	      this._$(this._parentSelector).on(touchStartEvent + '.player', this._domSelector, onTouchStart);
	      this._$(this._parentSelector).on('mousedown.player', this._domSelector, onMouseDown);
	      this._$(this._parentSelector).on('mouseup.player', this._domSelector, onMouseUp);
	      this._$(this._parentSelector).on('mousemove.player', this._domSelector, onMouseMove);
	      this._$(this._parentSelector).on('mouseout.player', this._domSelector, onMouseOut);
	      this._$(this._parentSelector).on(touchMoveEvent + '.player', this._domSelector, onTouchMove);
	      this._$(this._parentSelector).on(touchEndEvent + '.player', this._domSelector, onTouchEnd);
	    } else {
	      this._domElement.addEventListener('contextmenu', function (evt) {
	        evt.preventDefault();
	      });
	      this._domElement.addEventListener(touchStartEvent, onTouchStart);
	      this._domElement.addEventListener('mousedown', onMouseDown);
	      this._domElement.addEventListener('mouseup', onMouseUp);
	      this._domElement.addEventListener('mousemove', onMouseMove);
	      this._domElement.addEventListener('mouseout', onMouseOut);
	      this._domElement.addEventListener(touchMoveEvent, onTouchMove);
	      this._domElement.addEventListener(touchEndEvent, onTouchEnd);
	    }

	    this._enabled = true;
	  };

	  this.reset = function () {
	    if (this._controlAdapter) {
	      this._controlAdapter.reset();
	    }
	  };

	  this.disable = function () {
	    this._enabled = false;
	  };

	  this.enable = function () {
	    this._enabled = true;
	  };

	  this.setOnBeforeMouseMove = function (callback) {
	    this._onBeforeMouseMove = callback;
	  };

	  this.setOnBeforeTouchMove = function (callback) {
	    this._onBeforeTouchMove = callback;
	  };

	  this.setOnBeforeMouseDown = function (callback) {
	    this._onBeforeMouseDown = callback;
	  };

	  this.setOnBeforeTouchDown = function (callback) {
	    this._onBeforeTouchDown = callback;
	  };

	  this.setOnBeforeMouseUp = function (callback) {
	    this._onBeforeMouseUp = callback;
	  };

	  this.setOnBeforeTouchEnd = function (callback) {
	    this._onBeforeTouchEnd = callback;
	  };

	  this.setOnBeforeMouseOut = function (callback) {
	    this._onBeforeMouseOut = callback;
	  };

	  this.clickDrag = function (clientX, clientY) {
	    this._controlAdapter.end(clientX, clientY);
	    this._controlAdapter.begin(clientX, clientY);
	  };

	  function onMouseDown(e) {
	    scope._windowHalfX = scope._domElement.clientWidth / 2;
	    scope._windowHalfY = scope._domElement.clientHeight / 2;
	    e.preventDefault();
	    e.stopPropagation();
	    if (scope._onBeforeMouseDown) {
	      if (!scope._onBeforeMouseDown(e.clientX, e.clientY)) {
	        return false;
	      }
	    }
	    if (!scope._enabled) {
	      return false;
	    }
	    scope._dragging = true;
	    scope._controlAdapter.begin(e.clientX, e.clientY);
	    return false;
	  }

	  function onMouseUp(e) {
	    scope._windowHalfX = scope._domElement.clientWidth / 2;
	    scope._windowHalfY = scope._domElement.clientHeight / 2;
	    e.preventDefault();
	    e.stopPropagation();
	    if (!scope._enabled) {
	      return false;
	    }

	    if (scope._onBeforeMouseUp) {
	      if (!scope._onBeforeMouseUp(e.clientX, e.clientY)) {
	        return false;
	      }
	    }

	    scope._dragging = false;
	    scope.reset();
	    return false;
	  }

	  function onMouseMove(e) {
	    if (!scope._dragging) {
	      return true;
	    }
	    e.preventDefault();
	    e.stopPropagation();

	    if (!scope._enabled) {
	      return false;
	    }

	    if (scope._onBeforeMouseMove) {
	      if (!scope._onBeforeMouseMove(e.clientX, e.clientY)) {
	        return false;
	      }
	    }

	    scope._controlAdapter.end(e.clientX, e.clientY);
	    scope._controlAdapter.begin(e.clientX, e.clientY);
	    return false;
	  }

	  function onMouseOut(e) {
	    var tag, relatedTag;
	    if (!e) {
	      e = window.event;
	    }
	    e.preventDefault();
	    e.stopPropagation();
	    if (!scope._enabled) {
	      return false;
	    }
	    if (scope._onBeforeMouseOut) {
	      if (!scope._onBeforeMouseOut(e.clientX, e.clientY)) {
	        return false;
	      }
	    }
	    scope._dragging = false;
	    scope.reset();
	    return false;
	  }

	  function onTouchStart(evt) {
	    evt.preventDefault();
	    evt.stopPropagation();
	    var e = evt.originalEvent || evt;

	    if (!e.changedTouches && e.touches) {
	      e.changedTouches = e.touches;
	    }
	    if (e.changedTouches && e.changedTouches.length === 1 || !e.changedTouches) {

	      var tx = e.touches ? e.touches[0].pageX : e.screenX;
	      var ty = e.touches ? e.touches[0].pageY : e.screenY;

	      if (!scope._enabled) {
	        return false;
	      }

	      var x = tx - scope._windowHalfX;
	      var y = ty - scope._windowHalfY;

	      if (scope._onBeforeTouchDown) {
	        if (!scope._onBeforeTouchDown(x, y)) {
	          return false;
	        }
	      }

	      scope._dragging = true;
	      scope._controlAdapter.begin(x, y);
	    }
	    return false;
	  }
	  function onTouchMove(evt) {
	    if (!scope._dragging) {
	      return true;
	    }
	    evt.preventDefault();
	    evt.stopPropagation();
	    var e = evt.originalEvent || evt;

	    if (!e.changedTouches && e.touches) {
	      e.changedTouches = e.touches;
	    }
	    if (e.changedTouches && e.changedTouches.length === 1 || !e.changedTouches) {
	      var tx = e.changedTouches ? e.changedTouches[0].pageX : e.screenX;
	      var ty = e.changedTouches ? e.changedTouches[0].pageY : e.screenY;
	      if (!scope._enabled) {
	        return false;
	      }
	      var x = tx - scope._windowHalfX;
	      var y = ty - scope._windowHalfY;
	      if (scope._onBeforeTouchMove) {
	        if (!scope._onBeforeTouchMove(x, y)) {
	          return false;
	        }
	      }
	      scope._controlAdapter.end(x, y);
	      scope._controlAdapter.begin(x, y);
	    }
	    return false;
	  }

	  function onTouchEnd(evt) {
	    evt.preventDefault();
	    evt.stopPropagation();
	    var e = evt.originalEvent || evt;

	    if (!e.changedTouches && e.touches) {
	      e.changedTouches = e.touches;
	    }

	    if (e.changedTouches && e.changedTouches.length === 1 || !e.changedTouches) {
	      var tx = e.changedTouches ? e.changedTouches[0].pageX : e.screenX;
	      var ty = e.changedTouches ? e.changedTouches[0].pageY : e.screenY;

	      if (!scope._enabled) {
	        return false;
	      }

	      var x = tx - scope._windowHalfX;
	      var y = ty - scope._windowHalfY;

	      if (scope._onBeforeTouchEnd) {
	        if (!scope._onBeforeTouchEnd(x, y)) {
	          return false;
	        }
	      }

	      scope._dragging = false;
	      scope.reset();
	    }
	    return false;
	  }
	  this._initialize();
	};

	exports.AtlasSpriteSheetControls = AtlasSpriteSheetControls;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var AtlasImageWithProgress = function AtlasImageWithProgress() {
	  this.percentComplete = 0.0;
	  this.image = new Image();
	  this.cancelled = false;
	};

	AtlasImageWithProgress.prototype.load = function (url, callback, forceOlderBrowser) {
	  this.cancelled = false;

	  var xml = new XMLHttpRequest();
	  if ('onprogress' in xml && !forceOlderBrowser) {
	    this.percentComplete = 0.0;

	    xml.open('GET', url, true);
	    xml.responseType = 'arraybuffer';

	    var that = this;

	    xml.onload = function (e) {
	      var headers = xml.getAllResponseHeaders(),
	          contentType = headers.match(/^Content-Type\:\s*(.*?)$/mi),
	          mimeType = contentType[1] || 'image/png';

	      var blob = new Blob([this.response], { type: mimeType });
	      that.image.src = window.URL.createObjectURL(blob);
	      that.image.onload = function () {
	        window.URL.revokeObjectURL(that.image.src);
	        if (callback) {
	          callback(null, 100.0, that.image);
	        }
	      };
	    };

	    xml.onprogress = function (e) {
	      if (that.cancelled) {
	        try {
	          xml.abort();
	        } catch (e) {}
	      }

	      if (e.lengthComputable) {
	        that.percentComplete = e.loaded / e.total * 100.0;
	      }
	      if (that.percentComplete < 100.0) {
	        callback(null, that.percentComplete, null);
	      }
	    };

	    xml.onloadstart = function () {
	      that.percentComplete = 0.0;
	      callback(null, that.percentComplete, null);
	    };

	    xml.onloadend = function () {
	      that.percentComplete = 100.0;
	    };

	    xml.send();
	  } else {
	    var that = this;

	    this.image.onload = function () {
	      callback(null, 100.0, that.image);
	    };
	    this.image.src = url;
	  }
	};

	AtlasImageWithProgress.prototype.cancel = function () {
	  this.cancelled = true;
	};

	exports.AtlasImageWithProgress = AtlasImageWithProgress;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	function AtlasAPIAdapter() {
	  this._asset = {};
	}

	AtlasAPIAdapter.prototype.parseResponse = function (response) {
	  this._asset.productId = response.data.id;
	  this._asset.name = response.data.attributes.name;
	  //possibly null if not only spinner data is returned
	  this._asset.signature_image = response.data.attributes.search_preview_url;
	  if (this._asset.signature_image) {
	    var found = this._asset.signature_image.match(/600\/(.*)\.jpg/);
	    if (found) {
	      this._asset.initial_image = found[1];
	    }
	  }

	  //if there is included data, then it will pull spinner from there
	  var attributes = response.data.attributes;
	  if (response.included) {
	    attributes = response.included[0].attributes;
	  }

	  this._asset.sprites_300 = attributes.sprites_300_url;
	  this._asset.sprites_600 = attributes.sprites_600_url;
	  this._asset.extensions = { atlas: { camera_type_code: attributes.camera_type_code } };
	  this._asset.atlas = { camera_type_code: attributes.camera_type_code };

	  return true;
	};

	AtlasAPIAdapter.prototype.getAsset = function () {
	  return this._asset;
	};

	exports.AtlasAPIAdapter = AtlasAPIAdapter;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	function AtlasSPAdapter() {
	  this._asset = {};
	}

	AtlasSPAdapter.prototype.parseResponse = function (response) {
	  this._asset.productId = response.data.id;
	  this._asset.name = response.data.attributes.name;

	  var jpeg600 = findSpinnerAssetFile(response, "jpeg", "600");
	  if (!jpeg600) {
	    return false;
	  }
	  this._asset.signature_image = "//" + jpeg600.s3_bucket + jpeg600.s3_path + "/H01." + jpeg600.extension;
	  this._asset.sprites_600 = "//" + jpeg600.s3_bucket + jpeg600.s3_path + "/asset-600." + jpeg600.extension;

	  var jpeg300 = findSpinnerAssetFile(response, "jpeg", "300");
	  if (!jpeg300) {
	    return false;
	  }
	  this._asset.sprites_300 = "//" + jpeg300.s3_bucket + jpeg300.s3_path + "/asset-300." + jpeg300.extension;

	  var spinner = findSpinner(response);
	  if (!spinner) {
	    return false;
	  }
	  this._asset.extensions = { atlas: { camera_type_code: spinner.geometry_type } };
	  this._asset.atlas = { camera_type_code: spinner.geometry_type };

	  return true;
	};

	AtlasSPAdapter.prototype.getAsset = function () {
	  return this._asset;
	};

	AtlasSPAdapter.prototype.findSpinnerAssetFile = function (response, format, resolution) {
	  var spinnerFile = _.find(response.included, function (o) {
	    return o.type === "spinner_files" && o.format === format && o.resolution === resolution;
	  });

	  if (spinnerFile === null) {
	    return null;
	  }

	  var assetFile = _.find(response.included, function (o) {
	    return o.type === "asset_files" && o.id === spinnerFile.relationships.asset_file.data.id;
	  });

	  return assetFile;
	};

	AtlasSPAdapter.prototype.findSpinner = function (response) {
	  var spinner = _.find(response.included, function (o) {
	    return o.type == "spinners";
	  });

	  return spinner;
	};

	exports.AtlasSPAdapter = AtlasSPAdapter;

/***/ }
/******/ ])
});
;