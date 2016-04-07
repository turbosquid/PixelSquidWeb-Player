(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (AtlasClientCapabilities) {
    'use strict';
    var AtlasControlAdapter = function (context) {
        this._dragging = false;
        this._domElement = null;
        this._cellWidthInPixels = 10;
        this._cellHeightInPixels = 10;
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
                if (AtlasClientCapabilities.getCapabilities().eventListener) {
                    var event = document.createEvent('Event');
                    event.initEvent(this._changeEvent.type, true, true);
                    event.horizontal = horizontal;
                    event.vertical = vertical;
                    this._domElement.dispatchEvent(event);
                } else {
                    if (AtlasClientCapabilities.getCapabilities().jqueryEvents) {
                        jQuery(document).triggerHandler(this._changeEvent.type, {
                            type: this._changeEvent.type,
                            horizontal: horizontal,
                            vertical: vertical
                        });
                    }
                }
            }
        };
    };
    return AtlasControlAdapter;
}(require);
},{}]},{},[1]);
