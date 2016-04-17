function AtlasAPIAdapter() {
  this._asset = {};
}

AtlasAPIAdapter.prototype.parseResponse = function(response) {
  this._asset.productId = response.data.id;
  this._asset.sprites_300 = response.data.attributes.sprites_300_url;
  this._asset.sprites_600 = response.data.attributes.sprites_600_url;
  this._asset.extensions = { atlas: { camera_type_code: response.data.attributes.camera_type_code } };
  this._asset.atlas = { camera_type_code: response.data.attributes.camera_type_code };
}

AtlasAPIAdapter.prototype.getAsset = function() {
  return this._asset;
}

exports.AtlasAPIAdapter = AtlasAPIAdapter;
