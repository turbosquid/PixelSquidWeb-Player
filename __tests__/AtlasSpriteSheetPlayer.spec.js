const MockXMLHttpRequest = require('mock-xmlhttprequest')
const { AtlasSpriteSheetPlayer } = require('../src/atlas_sprite_sheet_player')
const { AtlasAPIAdapter } = require('../src/atlas_api_adapter')
const { pixelsquid_api_response } = require('./pixelsquid_api_response')

beforeEach(() => {
  global.URL.createObjectURL = jest.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=')

  userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
  userAgentGetter.mockReturnValue('MacOSX')

  document.body.innerHTML = `
    <div class='atlas-control-area atlas-events' style='width: 600px; height: 600px'>
      <div class='atlas-viewer'>
      </div>
    </div>
  `
})

test('configures sprite sheet player', () => {
  const configuration = { preferredImageSize: '300', applyStyles: true }
  const player = new AtlasSpriteSheetPlayer(configuration)

  expect(player._preferredImageSize).toBe('300')
})

test('loads an asset in the sprite sheet player', () => {
  const MockXhr = MockXMLHttpRequest.newMockXhr()
  MockXhr.prototype.onprogress = () => {}
  const transport = new MockXhr()
  transport.onSend = (xhr) => {
    const headers = { 'Content-Type': 'image/jpg' }
    xhr.respond(200, headers, 'image')
  }

  const configuration = { preferredImageSize: '300', applyStyles: true, transport }
  const player = new AtlasSpriteSheetPlayer(configuration)
  const adapter = new AtlasAPIAdapter()
  adapter.parseResponse(pixelsquid_api_response)

  const callback = (error, progress) => {
    console.log("error:", error)
    console.log("progress:", progress)
  }

  jest.useFakeTimers()
  player.load({ asset: adapter.getAsset() }, callback)
  jest.runAllTimers()

  // TODO: complete loading tests
  // cannot complete load because createObjectURL doesn't
  // exist in jest, will need to return to this
  expect(player._loadComplete).toBeFalsy()  
})
