function AtlasSPAdapter() {
  this._asset = {};
}

AtlasSPAdapter.prototype.parseResponse = function(response) {  
  this._asset.productId = response.data.id
  this._asset.name = response.data.attributes.name

  var jpeg600 = findSpinnerAssetFile(response, "jpeg", "600");
  if (!jpeg600) {
    return false;
  }
  this._asset.signature_image = `//${jpeg600.s3_bucket}${jpeg600.s3_path}/H01.${jpeg600.extension}`;
  this._asset.sprites_600 = `//${jpeg600.s3_bucket}${jpeg600.s3_path}/asset-600.${jpeg600.extension}`;

  var jpeg300 = findSpinnerAssetFile(response, "jpeg", "300");
  if (!jpeg300) {
    return false;
  }
  this._asset.sprites_300 = `//${jpeg300.s3_bucket}${jpeg300.s3_path}/asset-300.${jpeg300.extension}`;

  var spinner = findSpinner(response);
  if (!spinner) {
    return false;
  }
  this._asset.extensions = { atlas: { camera_type_code: spinner.geometry_type } };
  this._asset.atlas = { camera_type_code: spinner.geometry_type };

  return true;
}

AtlasSPAdapter.prototype.getAsset = function() {
  return this._asset;
}

AtlasSPAdapter.prototype.findSpinnerAssetFile = function(response, format, resolution) {
  var spinnerFile = _.find(response.included, function(o) {
    return (o.type === "spinner_files" && o.format === format && o.resolution === resolution)
  });

  if (spinnerFile === null) {
    return null;
  }

  var assetFile = _.find(response.included, function(o) {
    return (o.type === "asset_files" && o.id === spinnerFile.relationships.asset_file.data.id)
  });

  return assetFile;
}

AtlasSPAdapter.prototype.findSpinner = function(response) {
  var spinner = _.find(response.included, function(o) {
    return (o.type == "spinners");
  });

  return spinner;
}

exports.AtlasSPAdapter = AtlasSPAdapter;
