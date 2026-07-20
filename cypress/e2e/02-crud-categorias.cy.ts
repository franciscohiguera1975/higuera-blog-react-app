// cypress/e2e/02-crud-categorias.cy.ts
import { mockCategories } from '../support/mocks/categories'
import { uniqueName } from '../support/utils'

describe('CRUD de Categorías', () => {
  it('crea una categoría nueva', () => {
    mockCategories()
    cy.loginByApi('/categorias')

    const name = uniqueName('Categoría')
    cy.contains('button', 'Nueva categoría').click()
    cy.contains('Nueva categoría').should('be.visible')
    cy.get('#name').type(name)
    cy.contains('button', 'Guardar').click()

    cy.wait('@createCategory')
    cy.contains('td', name).should('be.visible')
  })

  it('edita una categoría existente', () => {
    const name = uniqueName('Categoría')
    mockCategories([{ id: crypto.randomUUID(), name }])
    cy.loginByApi('/categorias')

    const newName = uniqueName('Categoría editada')
    cy.contains('td', name)
      .parent('tr')
      .within(() => cy.contains('button', 'Editar').click())
    cy.contains('Editar categoría').should('be.visible')
    cy.get('#name').clear().type(newName)
    cy.contains('button', 'Guardar').click()

    cy.contains('td', newName).should('be.visible')
  })

  it('borra una categoría existente', () => {
    const name = uniqueName('Categoría')
    mockCategories([{ id: crypto.randomUUID(), name }])
    cy.loginByApi('/categorias')

    cy.contains('td', name)
      .parent('tr')
      .within(() => cy.contains('button', 'Borrar').click())

    cy.contains('td', name).should('not.exist')
  })
})
