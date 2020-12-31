describe('click and drag to rotate object', () => {
  it('loads and rotates an object', () => {
    cy.visit('http://localhost:8080/examples')
    cy.intercept('**/assets_v2/**').as('retrieveImage')
    cy.wait('@retrieveImage')
    cy.get('.atlas-viewer').children().should('have.length', 1)
    cy.get('.progress').should('be.hidden')

    cy.window()
      .then((window) => {
        const cellSize = window.player.isCanvasRender() ? 5 : 10

        const getImageIndex = () => window.player.getCurrentImageIndex()
        cy.wrap({ f: getImageIndex }).invoke('f').should('eq', 'G03')

        cy.get('canvas')
          .trigger('mousedown', { which: 1, clientX: 100, clientY: 100 })
          .trigger('mousemove', { clientX: 100 + cellSize, clientY: 100 })
          .trigger('mouseup', { force: true })

        cy.wrap({ f: getImageIndex }).invoke('f').should('eq', 'G02')

        cy.get('canvas')
          .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
          .trigger('mousemove', { clientX: 150 + cellSize / 2, clientY: 150 })
          .trigger('mouseup', { force: true })

        cy.wrap({ f: getImageIndex }).invoke('f').should('eq', 'G02')

        cy.get('canvas')
          .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
          .trigger('mousemove', { clientX: 150, clientY: 150 + cellSize })
          .trigger('mouseup', { force: true })

        cy.wrap({ f: getImageIndex }).invoke('f').should('eq', 'F02')

        cy.get('canvas')
          .trigger('mousedown', { which: 1, clientX: 150, clientY: 150 })
          .trigger('mousemove', { clientX: 150, clientY: 150 + cellSize })
          .trigger('mousemove', { clientX: 150 + cellSize, clientY: 150 + cellSize })
          .trigger('mousemove', { clientX: 150 + 2 * cellSize, clientY: 150 + 2 * cellSize })
          .trigger('mousemove', { clientX: 150 + 4 * cellSize, clientY: 150 + 4 * cellSize })
          .trigger('mouseup', { force: true })

        cy.wrap({ f: getImageIndex }).invoke('f').should('eq', 'C14')
      })
  })
})
