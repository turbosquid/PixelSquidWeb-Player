'use strict';
var AtlasClientCapabilities = require('./atlas_client_capabilities').AtlasClientCapabilities;

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
      }
      else {
        if (typeof CustomEvent !== 'undefined') {
          this._domElement.dispatchEvent(new CustomEvent(this.changeEvent.type, { horizontal: horizontal, vertical: vertical }));
        }

        if (typeof document.createEvent !== 'undefined') {
          var event = document.createEvent('Event');
          event.initEvent(this._changeEvent.type, true, true);
          event.horizontal = horizontal;
          event.vertical = vertical;
          this._domElement.dispatchEvent(event);
        }

        // photoshop
        if (typeof Event !== 'undefined') {
          var eventObject = new Event(this._changeEvent.type)
          eventObject.horizontal = horizontal
          eventObject.vertical = vertical
          this._domElement.dispatchEvent(eventObject)
        }
      }
    }
  };
};
