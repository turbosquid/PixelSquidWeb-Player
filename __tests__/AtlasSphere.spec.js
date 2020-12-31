const { AtlasSphere } = require('../src/atlas_sphere')

const VALID_LATITUDES = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
const VALID_LONGITUDES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']

let sphere
beforeEach(() => {
  sphere = new AtlasSphere()
  sphere.initPartial(VALID_LATITUDES, VALID_LONGITUDES, false, 600)
})

test('initializes a standard sphere', () => {
  expect(sphere.getUniqueSphereCellCount()).toBe(14 * 16)
})

test('resolves lat and lon to index', () => {
  let cell = sphere.getSphereCellForLatLon(0, 0)
  expect(cell.imageIndex).toBe('B01')

  cell = sphere.getSphereCellForLatLon(3, 3)
  expect(cell.imageIndex).toBe('E04')
})

test('resolves face to lat and lon', () => {
  let cell = sphere.getSphereCellForFace(0)
  expect(cell.imageIndex).toBe('B01')

  cell = sphere.getSphereCellForFace(3 * 16 + 3)
  expect(cell.imageIndex).toBe('E04')
})
