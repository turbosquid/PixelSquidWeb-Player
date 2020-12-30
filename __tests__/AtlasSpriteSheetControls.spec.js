const { AtlasControlAdapter } = require('../src/atlas_control_adapter')
const { AtlasSpriteSheetControls } = require('../src/atlas_sprite_sheet_controls')

let adapter, element, controls

describe('desktop controls', () => {
  beforeEach(() => {
    userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get')
    userAgentGetter.mockReturnValue('MacOSX')

    document.body.innerHTML = `
      <div class='parent'>
        <div class='element'>
        </div>
      </div>
    `

    element = document.querySelectorAll('.element')[0]

    adapter = new AtlasControlAdapter()
    controls = new AtlasSpriteSheetControls('.parent', '.element', adapter)
  })

  test('controls are enabled by default', () => {
    expect(controls._enabled).toBeTruthy()
  })

  test('controls respond to mouse down / mouse move / mouse up', () => {
    const mouseDown = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseDown(mouseDown)

    const mouseMove = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseMove(mouseMove)

    const mouseUp = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseUp(mouseUp)

    const down = new MouseEvent('mousedown', {
      clientX: 0,
      clientY: 0,
      buttons: 1
    })
    element.dispatchEvent(down)

    const move = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      buttons: 1
    })
    element.dispatchEvent(move)

    const up = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10,
      buttons: 0
    })
    element.dispatchEvent(up)

    expect(mouseDown).toHaveBeenCalledTimes(1)
    expect(mouseMove).toHaveBeenCalledTimes(1)
    expect(mouseUp).toHaveBeenCalledTimes(1)
  })

  test('controls do not respond when disabled', () => {
    controls.disable()

    const mouseDown = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseDown(mouseDown)

    const mouseMove = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseMove(mouseMove)

    const mouseUp = jest.fn().mockReturnValue(true)
    controls.setOnBeforeMouseUp(mouseUp)

    const down = new MouseEvent('mousedown', {
      clientX: 0,
      clientY: 0,
      buttons: 1
    })
    element.dispatchEvent(down)

    const move = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 100,
      buttons: 1
    })
    element.dispatchEvent(move)

    const up = new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 10,
      buttons: 0
    })
    element.dispatchEvent(up)

    // odd that mouse down gets called before checking if enabled
    // may need to replicate that functionality to be backward
    // compatible
    expect(mouseDown).toHaveBeenCalledTimes(1)
    expect(mouseMove).toHaveBeenCalledTimes(0)
    expect(mouseUp).toHaveBeenCalledTimes(0)
  })
})

