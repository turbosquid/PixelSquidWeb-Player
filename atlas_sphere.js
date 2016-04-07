(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (Constants) {
    'use strict';
    var AtlasSphere = function () {
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
    return AtlasSphere;
}(require);
},{}]},{},[1]);
