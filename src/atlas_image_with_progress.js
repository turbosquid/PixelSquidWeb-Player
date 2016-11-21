'use strict';

var AtlasImageWithProgress = function () {
  this.percentComplete = 0.0;
  this.image = new Image();
  this.cancelled = false;
}

AtlasImageWithProgress.prototype.load = function(url, callback, forceOlderBrowser) {
  this.cancelled = false;

  var xml = new XMLHttpRequest();
  if (('onprogress' in xml) && (!forceOlderBrowser)) {
    this.percentComplete = 0.0;

    xml.open('GET', url, true);
    xml.responseType = 'arraybuffer';

    var that = this;

    xml.onload = function(e) {
      var headers = xml.getAllResponseHeaders(),
        contentType = headers.match(/^Content-Type\:\s*(.*?)$/mi),
        mimeType = contentType[1] || 'image/png';

      var blob = new Blob([this.response], { type: mimeType });
      that.image.src = window.URL.createObjectURL(blob);
      that.image.onload = function() {
        window.URL.revokeObjectURL(that.image.src)
        if (callback) {
          callback(null, 100.0, that.image);
        }
      }
    };

    xml.onprogress = function(e) {
      if (that.cancelled) {
        try {
          xml.abort();
        }
        catch(e) {
        }
      }

      if (e.lengthComputable) {
        that.percentComplete = (e.loaded / e.total) * 100.0;
      }
      if (that.percentComplete < 100.0) {
        callback(null, that.percentComplete, null);
      }
    };

    xml.onloadstart = function() {
      that.percentComplete = 0.0;
      callback(null, that.percentComplete, null);
    };

    xml.onloadend = function() {
      that.percentComplete = 100.0;
    };

    xml.send();
  }
  else {
    var that = this;

    this.image.onload = function() {
      callback(null, 100.0, that.image);
    };
    this.image.src = url;
  }
};

AtlasImageWithProgress.prototype.cancel = function() {
  this.cancelled = true;
};

exports.AtlasImageWithProgress = AtlasImageWithProgress;
