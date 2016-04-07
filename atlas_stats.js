(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function () {
    'use strict';
    var AtlasStats = {};
    AtlasStats.connect = function (_addr, _environment, _application, _secure_addr) {
        if (typeof JSON == 'undefined' || !JSON || !JSON.stringify || JSON.stringify({}).nojson) {
            AtlasStats.send = function () {
            };
        }
        AtlasStats.addr = _addr;
        if (AtlasStats.addr.charAt(AtlasStats.addr.length - 1) != '/')
            AtlasStats.addr += '/';
        if (AtlasStats.addr.indexOf('http://') < 0)
            AtlasStats.addr = 'http://' + AtlasStats.addr;
        AtlasStats.secure_addr = _secure_addr || AtlasStats.addr;
        if (AtlasStats.secure_addr.charAt(AtlasStats.secure_addr.length - 1) != '/')
            AtlasStats.secure_addr += '/';
        if (AtlasStats.secure_addr.indexOf('http://') == 0) {
            AtlasStats.secure_addr = AtlasStats.secure_addr.replace('http://', 'https://');
        }
        AtlasStats.environment = _environment;
        AtlasStats.application = _application;
    };
    AtlasStats.createStatPath = function (type, stat) {
        if (!AtlasStats.environment || !AtlasStats.application) {
            return 'pre_initialization.' + type + '.' + stat;
        } else {
            return AtlasStats.environment + '.' + type + '.' + AtlasStats.application + '.' + stat;
        }
    };
    AtlasStats._increment = function (stat, sampleRate) {
        sampleRate = sampleRate || 1;
        AtlasStats.send([
            'i',
            stat,
            sampleRate
        ]);
    };
    AtlasStats.increment = function (type, stat, sampleRate) {
        AtlasStats._increment(AtlasStats.createStatPath(type, stat), sampleRate);
    };
    AtlasStats.incrementIn = function (type, stat, timeout, sampleRate) {
        setTimeout(function () {
            AtlasStats.increment(type, stat, sampleRate);
        }, timeout);
    };
    AtlasStats._decrement = function (stat, sampleRate) {
        sampleRate = sampleRate || 1;
        AtlasStats.send([
            'd',
            stat,
            sampleRate
        ]);
    };
    AtlasStats.decrement = function (type, stat, sampleRate) {
        AtlasStats._decrement(AtlasStats.createStatPath(type, stat), sampleRate);
    };
    AtlasStats._gauge = function (stat, value, sampleRate) {
        sampleRate = sampleRate || 1;
        AtlasStats.send([
            'g',
            stat,
            value,
            sampleRate
        ]);
    };
    AtlasStats.gauge = function (type, stat, sampleRate) {
        AtlasStats._gauge(AtlasStats.createStatPath(type, stat), sampleRate);
    };
    AtlasStats._timing = function (stat, time, sampleRate) {
        sampleRate = sampleRate || 1;
        if ('number' == typeof time) {
            return AtlasStats.send([
                't',
                stat,
                time,
                sampleRate
            ]);
        }
        if (time instanceof Date) {
            return AtlasStats.send([
                't',
                stat,
                fromNow(time),
                sampleRate
            ]);
        }
        if ('function' == typeof time) {
            var start = new Date();
            time();
            AtlasStats.send([
                't',
                stat,
                fromNow(start),
                sampleRate
            ]);
        }
    };
    AtlasStats.timing = function (type, stat, time, sampleRate) {
        return AtlasStats._timing(AtlasStats.createStatPath(type, stat), time, sampleRate);
    };
    AtlasStats._timer = function (stat, sampleRate) {
        sampleRate = sampleRate || 1;
        var start = new Date().getTime();
        return function () {
            AtlasStats.send([
                't',
                stat,
                fromNow(start),
                sampleRate
            ]);
        };
    };
    AtlasStats.timer = function (type, stat, sampleRate) {
        return AtlasStats._timer(AtlasStats.createStatPath(type, stat), sampleRate);
    };
    AtlasStats.send = function () {
        var queue = [];
        var head = document.getElementsByTagName('head')[0];
        setInterval(function () {
            var url = location.protocol === 'https:' ? AtlasStats.secure_addr : AtlasStats.addr;
            if (url && queue.length > 0) {
                for (var i = 0; i < queue.length; i++) {
                    for (var j = 0; j < queue[i].length; j++) {
                        if (queue[i][j] == null)
                            queue[i].splice(j, 1);
                    }
                }
                var tag = document.createElement('script');
                tag.src = url + JSON.stringify(queue);
                tag.onload = function () {
                    head.removeChild(tag);
                };
                head.appendChild(tag);
                queue = [];
            }
        }, 5000);
        return function (data) {
            if (AtlasStats.addr) {
                queue.push(data);
            }
        };
    }();
    function fromNow(date) {
        return new Date() - date;
    }
    return AtlasStats;
}();
},{}]},{},[1]);
