const { AtlasSPAdapter } = require('../src/atlas_sp_adapter')
const { squid_products_response } = require('./squid_products_response')

test('initializes to an empty object', () => {
  const adapter = new AtlasSPAdapter()
  expect(adapter.getAsset()).toMatchObject({})
})

test('loads an asset from squid products', () => {
  const adapter = new AtlasSPAdapter()
  expect(adapter.parseResponse(squid_products_response)).toBeTruthy()

  const asset = adapter.getAsset()
  expect(asset.sprites_300).toBe('https://atlas-content-cdn.pixelsquid.com/assets_v2/218/2186277947357271440/jpeg-300/atlas-300.jpg')
  expect(asset.sprites_600).toBe('https://atlas-content-cdn.pixelsquid.com/assets_v2/218/2186277947357271440/jpeg-600/atlas-600.jpg')
})
