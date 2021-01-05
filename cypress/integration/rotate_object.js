const LATITUDES = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
const LONGITUDES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']

const calculateNextCell = (currentCell, latitudes, longitudes) => {
  const lat = currentCell.slice(0, 1)
  const lon = currentCell.slice(1)

  let latIndex = (LATITUDES.indexOf(lat) + latitudes)
  let lonIndex = (LONGITUDES.indexOf(lon) + longitudes)

  if (latIndex < 0) {
    latIndex += LATITUDES.length
  }
  if (lonIndex < 0) {
    lonIndex += LONGITUDES.length
  }

  latIndex = latIndex % LATITUDES.length
  lonIndex = lonIndex % LONGITUDES.length

  return LATITUDES[latIndex] + LONGITUDES[lonIndex]
}

const loadURL = (url) => {
  cy.visit(url)
  cy.intercept('**/assets_v2/**').as('retrieveImage')
  cy.wait('@retrieveImage')
  cy.get('.atlas-viewer').children().should('have.length', 1)
  cy.get('.progress').should('be.hidden')
}

const testRotation = (useCanvas) => {
  cy.window()
  .then((window) => {
    const element = useCanvas ? 'canvas' : '.atlas-control-area > div'

    const cellSize = window.player.isCanvasRender() ? 5 : 5

    const getImageIndex = () => window.player.getCurrentImageIndex()
    let nextCell = getImageIndex()

    cy.wrap({ f: getImageIndex }).invoke('f').should('eq', nextCell)

    cy.get(element)
      .trigger('mousedown', { which: 1, clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 100 + cellSize, clientY: 100 })
      .trigger('mouseup', { force: true })

    nextCell = calculateNextCell(nextCell, 0, -1)
    
    cy.wrap({ f: getImageIndex }).invoke('f').should('eq', nextCell)

    cy.get(element)
      .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
      .trigger('mousemove', { clientX: 150 + cellSize / 2, clientY: 150 })
      .trigger('mouseup', { force: true })

    cy.wrap({ f: getImageIndex }).invoke('f').should('eq', nextCell)

    cy.get(element)
      .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
      .trigger('mousemove', { clientX: 150, clientY: 150 + cellSize })
      .trigger('mouseup', { force: true })

    nextCell = calculateNextCell(nextCell, -1, 0)

    cy.wrap({ f: getImageIndex }).invoke('f').should('eq', nextCell)

    cy.get(element)
      .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
      .trigger('mousemove', { clientX: 150, clientY: 150 + cellSize })
      .trigger('mousemove', { clientX: 150 + cellSize, clientY: 150 + cellSize })
      .trigger('mousemove', { clientX: 150 + 2 * cellSize, clientY: 150 + 2 * cellSize })
      .trigger('mousemove', { clientX: 150 + 4 * cellSize, clientY: 150 + 4 * cellSize })
      .trigger('mouseup', { force: true })

    nextCell = calculateNextCell(nextCell, -3, -4)

    cy.wrap({ f: getImageIndex }).invoke('f').should('eq', nextCell)
  })
}

describe('click and drag to rotate object', () => {
  [{index: 0}, {index: 1}, {index: 2}, {index: 0, nocanvas: 1}, {index: 1, nocanvas: 1}, {index: 2, nocanvas: 1}].forEach((item) => {
    it(`tests object ${item.index} with${item.nocanvas ? 'out canvas' : ' canvas'}`, () => {
      const url = `http://localhost:8080/examples/?productIndex=${item.index}${item.nocanvas ? '&nocanvas=1' : ''}`
      loadURL(url)
      testRotation(item.nocanvas === undefined)
    })
  })
})
