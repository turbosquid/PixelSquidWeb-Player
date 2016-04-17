function AtlasAPIAdapter() {
  this._asset = {};
}

AtlasAPIAdapter.prototype.parseResponse = function(response) {
  this._asset.productId = response.data.id;
  this._asset.name = response.data.attributes.name;
  //possibly null if not only spinner data is returned
  this._asset.signature_image = response.data.attributes.search_preview_url;

  //if there is included data, then it will pull spinner from there
  var attributes = response.data.attributes;
  if (response.included) {
    attributes = response.included[0].attributes;
  }

  this._asset.sprites_300 = attributes.sprites_300_url;
  this._asset.sprites_600 = attributes.sprites_600_url;
  this._asset.extensions = { atlas: { camera_type_code: attributes.camera_type_code } };
  this._asset.atlas = { camera_type_code: attributes.camera_type_code };
}

AtlasAPIAdapter.prototype.getAsset = function() {
  return this._asset;
}

exports.AtlasAPIAdapter = AtlasAPIAdapter;
