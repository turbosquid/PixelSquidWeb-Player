'use strict';
var AtlasClientCapabilities = require('./atlas_client_capabilities').AtlasClientCapabilities;

var AtlasSpriteSheetControls = function (parentSelector, domSelector, controlAdapter) {
  this._parentSelector = parentSelector;
  this._domSelector = domSelector;
  this._domElement = $(this._domSelector)[0];
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
    $(this._parentSelector).on('contextmenu.player', this._domSelector, function (e) {
      e.preventDefault();
    });
    $(this._parentSelector).on(touchStartEvent + '.player', this._domSelector, onTouchStart);
    $(this._parentSelector).on('mousedown.player', this._domSelector, onMouseDown);
    $(this._parentSelector).on('mouseup.player', this._domSelector, onMouseUp);
    $(this._parentSelector).on('mousemove.player', this._domSelector, onMouseMove);
    $(this._parentSelector).on('mouseout.player', this._domSelector, onMouseOut);
    $(this._parentSelector).on(touchMoveEvent + '.player', this._domSelector, onTouchMove);
    $(this._parentSelector).on(touchEndEvent + '.player', this._domSelector, onTouchEnd);
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
  function onTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
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
  function onTouchMove(e) {
    if (!scope._dragging) {
      return true;
    }
    e.preventDefault();
    e.stopPropagation();
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
  function onTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
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
