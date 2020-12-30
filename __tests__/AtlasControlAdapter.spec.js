require('jest-canvas-mock')
const { AtlasClientCapabilities } = require('../src/atlas_client_capabilities')
const { AtlasControlAdapter } = require('../src/atlas_control_adapter')

let userAgentGetter;
let retinaGetter;

beforeEach(() => {
  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
  userAgentGetter.mockReturnValue('MacOSX')

  retinaGetter = jest.spyOn(AtlasClientCapabilities, 'getCapabilities')
})

describe('tests without retina', () => {
  beforeEach(() => {
    retinaGetter.mockReturnValue({ isRetinaCapable: false })
  })

  test('initializes without jquery', () => {
    const controls = new AtlasControlAdapter()

    expect(controls._cellWidthInPixels).toBe(10)
    expect(controls._cellHeightInPixels).toBe(10)
  })

  test('does not fire change if moved less than cell', () => {
    const handler = jest.fn()
    let domElement = document.createElement('div')
    domElement.addEventListener('change', handler)

    const controls = new AtlasControlAdapter()
    controls._domElement = domElement
    controls.begin(0, 0)
    controls.end(1, 0)

    expect(handler).toHaveBeenCalledTimes(0)
  })

  test('fires change if moved more than cell', () => {
    const handler = jest.fn()
    let domElement = document.createElement('div')
    domElement.addEventListener('change', handler)

    const controls = new AtlasControlAdapter()
    controls._domElement = domElement
    controls.begin(0, 0)
    controls.end(controls._cellWidthInPixels, 0)

    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('tests with retina', () => {
  beforeEach(() => {
    retinaGetter.mockReturnValue({ isRetinaCapable: true })
  })

  test('initializes without jquery', () => {
    const controls = new AtlasControlAdapter()

    expect(controls._cellWidthInPixels).toBe(5)
    expect(controls._cellHeightInPixels).toBe(5)
  })
})
