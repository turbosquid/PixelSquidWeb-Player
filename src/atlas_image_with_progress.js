'use strict';

var AtlasImageWithProgress = function (div) {
  this.percentComplete = 0.0;
  this.image = new Image();
  this.parentElement = null
  if (div) {
    var element = document.querySelectorAll(div);
    if (element && element.length) {
      this.parentElement = element[0]
      // this is needed for photoshop, setting display of none does not work
      this.image.style.width = 0
      this.image.style.height = 0
      this.parentElement.appendChild(this.image)
    }
  }
  this.cancelled = false;
}

AtlasImageWithProgress.prototype.unload = function() {
  this.image = null
}

AtlasImageWithProgress.prototype.loadLocal = function(url, callback) {
  // assumption url is created using createObjectURL with blob of data
  // loaded from the local filesystem
  if (callback) {
    callback(null, 0.0, null);
  }

  var that = this

  this.image.onload = function() {
    try {
      window.URL.revokeObjectURL(url)
      if (that.parentElement) {
        that.parentElement.removeChild(that.image)
      }
      if (callback) {
        var size = {
          width: that.image.width || that.image.naturalWidth,
          height: that.image.height || that.image.naturalHeight,
        }
        callback(null, 100.0, that.image, size)
      }
    } catch(e) {
      console.log(e)
    }
  }

  this.image.onerror = function() {
    if (callback) {
      callback('error loading local atlas image', null, null)
    }
  }

  this.image.src = url
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
      try {
        var headers = xml.getAllResponseHeaders(),
          contentType = headers.match(/^Content-Type\:\s*(.*?)$/mi),
          mimeType = contentType[1] || 'image/png';

        var blob = new Blob([xml.response], { type: mimeType });
        var imgUrl = window.URL.createObjectURL(blob)

        that.image.onload = function() {
          try {
            window.URL.revokeObjectURL(imgUrl)
            if (that.parentElement) {
              that.parentElement.removeChild(that.image)
            }
            if (callback) {
              var size = {
                width: that.image.width || that.image.naturalWidth,
                height: that.image.height || that.image.naturalHeight,
              }
              callback(null, 100.0, that.image, size);
            }
          }
          catch (e) {
            console.log(e)
          }
        };

        that.image.onerror = function () {
          if (callback) {
            callback('error loading atlas image', null, null);
          }
        };

        that.image.src = imgUrl;
      } catch(e) {
        console.log(e)
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
