(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {
    'use strict';
    var AtlasClientCapabilities = function () {
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
                this._capabilities.imagePreferences = [
                    {
                        resolution: '2k',
                        format: 'jpeg'
                    },
                    {
                        resolution: '600',
                        format: 'jpeg'
                    },
                    {
                        resolution: '300',
                        format: 'jpeg'
                    }
                ];
            } else if (this._capabilities.windowDimensions.width === 300) {
                this._capabilities.imagePreferences = [
                    {
                        resolution: '600',
                        format: 'jpeg'
                    },
                    {
                        resolution: '300',
                        format: 'jpeg'
                    },
                    {
                        resolution: '2k',
                        format: 'jpeg'
                    }
                ];
            }
        } else {
            if (this._capabilities.windowDimensions.width === 600) {
                this._capabilities.imagePreferences = [
                    {
                        resolution: '600',
                        format: 'jpeg'
                    },
                    {
                        resolution: '300',
                        format: 'jpeg'
                    },
                    {
                        resolution: '2k',
                        format: 'jpeg'
                    }
                ];
            } else if (this._capabilities.windowDimensions.width === 300) {
                this._capabilities.imagePreferences = [
                    {
                        resolution: '300',
                        format: 'jpeg'
                    },
                    {
                        resolution: '600',
                        format: 'jpeg'
                    },
                    {
                        resolution: '2k',
                        format: 'jpeg'
                    }
                ];
            }
        }
    };
    return AtlasClientCapabilities;
}();
},{}]},{},[1]);
