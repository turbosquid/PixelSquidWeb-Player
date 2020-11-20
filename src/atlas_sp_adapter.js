function AtlasSPAdapter() {
  this._asset = {};
}

AtlasSPAdapter.prototype.parseResponse = function(response) {  
  this._asset.productId = response.data.id;
  this._asset.name = response.data.name;
  this._asset.extensions = response.data.extensions;
  this._asset.atlas = response.data.atlas;
  this._asset.initial_image = response.data.initial_image;
  this._asset.signature_image = response.data.signature_image;
  this._asset.sprites_600 = response.data.sprites_600;
  this._asset.sprites_300 = response.data.sprites_300;

  return true;
}

AtlasSPAdapter.prototype.getAsset = function() {
  return this._asset;
}

exports.AtlasSPAdapter = AtlasSPAdapter;
