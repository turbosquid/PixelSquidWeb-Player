require('jest-canvas-mock')
const { AtlasClientCapabilities } = require('../src/atlas_client_capabilities')

let userAgentGetter;

beforeEach(() => {
  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
  userAgentGetter.mockReturnValue('MacOSX')
})

test('identifies canvas', () => {
  const capabilities = AtlasClientCapabilities.getCapabilities()

  expect(capabilities.canvasAvailable).toBeTruthy()
  expect(capabilities.renderToCanvas).toBeTruthy()
})

test('overrides rendering to canvas', () => {
  AtlasClientCapabilities.mergeCapabilities({ renderToCanvas: false })
  const capabilities = AtlasClientCapabilities.getCapabilities()

  expect(capabilities.canvasAvailable).toBeTruthy()
  expect(capabilities.renderToCanvas).toBeFalsy()
})
