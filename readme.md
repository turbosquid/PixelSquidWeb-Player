# Atlas 2 - JavaScript viewer for photo-real 3D objects

## Integration
1.  The default markup should match:
```
<div class='atlas-events'>
  <div class='atlas-control-area atlas-viewer'>
  </div>
</div>
```
(the markup can be overriden in the sprite sheet constructor)

2.  Add the source from [dist/pixelsquid-atlas.js](./dist/pixelsquid-atlas.js) to your project.
3.  Create an instance of `PixelSquid.AtlasAPIAdapter` and pass in the response from the [PixelSquid API - GET /products/productId](http://pixelsquid-api-docs-prod.s3-website-us-east-1.amazonaws.com/apidoc.html)
4.  (optional) Show a static loading image using the `signature_image` property of the asset from the api adapter.
5.  Create an instance of `PixelSquid.AtlasSpriteSheetPlayer` and call load passing in the asset from the api adapter.

A sample spinner integration can bee seen in [examples/index.html](./examples/index.html).

## Developing or Running Examples Locally
1.  Make sure you are runing nodejs version v5.8.0 or later and npm version 3.7.3 or later
2.  Clone this repository into a new directory, and install dependencies with `yarn install`.
3.  Use `yarn start` to start up a local development server.

* [http://localhost:8080/examples/index.html](http://localhost:8080/examples/index.html) uses the [PixelSquid API](https://api.pixelsquid.com/apidoc/1.0) to display a spinner and download the high resolution transparent PNG of the currently selected angle.
* [http://localhost:8080/examples/search.html](http://localhost:8080/examples/search.html) uses the [PixelSquid API](https://api.pixelsquid.com/apidoc/1.0) to show an example of search results

Both examples demonstrate using client-side ajax calls to a local proxy that communicates with the PixelSquid API.  These are for illustration purposes only.  These examples push most of the logic and authentication into the client in order to make it easier to understand, but in a real production application, the authentication header should be added only when communicating from your server to the PixelSquid API server (and not sent from the client).  The PixelSquid API does not allow CORS requests, so an intermediate server is required.
