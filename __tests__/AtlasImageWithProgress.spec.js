const MockXMLHttpRequest = require('mock-xmlhttprequest')
const { AtlasImageWithProgress } = require('../src/atlas_image_with_progress')

beforeEach(() => {
  global.URL.createObjectURL = jest.fn().mockReturnValue('image')
})

test('downloads an image and reports progress', () => {
  jest.useFakeTimers()

  const MockXhr = MockXMLHttpRequest.newMockXhr()
  MockXhr.prototype.onprogress = () => {}
  const transport = new MockXhr()
  transport.onSend = (xhr) => {
    const headers = { 'Content-Type': 'image/jpg' }

    xhr.setResponseHeaders(200, headers)
    xhr.downloadProgress(50, 100)
    xhr.setResponseBody()
  }

  let callback = jest.fn()

  const image = new AtlasImageWithProgress(null, transport)
  image.load('/image', callback)

  jest.runAllTimers()

  expect(callback).toHaveBeenCalledTimes(3)
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1)
})

test('loads an image locally', () => {
  jest.useFakeTimers()

  let callback = jest.fn()

  const image = new AtlasImageWithProgress()
  image.loadLocal('/image', callback)

  expect(callback).toHaveBeenCalledTimes(1)

  jest.runAllTimers()
})
