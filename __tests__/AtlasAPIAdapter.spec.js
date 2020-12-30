const { AtlasAPIAdapter } = require('../src/atlas_api_adapter')
const { pixelsquid_api_response } = require('./pixelsquid_api_response')

test('initializes to an empty asset', () => {
  const adapter = new AtlasAPIAdapter()
  expect(adapter.getAsset()).toMatchObject({})
})

test('loads an asset from the pixelsquid_api', () => {
  const adapter = new AtlasAPIAdapter()
  expect(adapter.parseResponse(pixelsquid_api_response)).toBeTruthy()

  const asset = adapter.getAsset()
  expect(asset.productId).toBe('924832797581907663')
  expect(asset.name).toBe('Deinonychus')
  expect(asset.signature_image).toBe('https://atlas-content1-cdn.pixelsquid.com/assets/924832797581907663/jpeg-600/H03.jpg')
  expect(asset.initial_image).toBe('H03')
  expect(asset.sprites_300).toBe('https://atlas-content1-cdn.pixelsquid.com/assets/924832797581907663/jpeg-300/atlas-300.jpg')
  expect(asset.sprites_600).toBe('https://atlas-content1-cdn.pixelsquid.com/assets/924832797581907663/jpeg-600/atlas-600.jpg')
})
