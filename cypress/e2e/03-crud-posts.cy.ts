// cypress/e2e/03-crud-posts.cy.ts
import { mockCategories } from '../support/mocks/categories'
import { mockPosts } from '../support/mocks/posts'
import { uniqueName } from '../support/utils'

describe('CRUD de Posts', () => {
  it('crea un post nuevo con categoría', () => {
    const categoryName = uniqueName('Categoría de posts')
    const category = { id: crypto.randomUUID(), name: categoryName }
    mockCategories([category])
    mockPosts([category])
    cy.loginByApi('/posts')

    const title = uniqueName('Post')
    cy.contains('button', 'Nuevo post').click()
    cy.contains('Nuevo post').should('be.visible')
    cy.get('#title').type(title)
    cy.get('#content').type('Contenido de prueba generado por Cypress.')
    cy.contains('button', 'Selecciona una categoría').click()
    cy.get('[role="option"]').contains(categoryName).click()
    cy.contains('button', 'Guardar').click()

    cy.wait('@createPost')
    cy.contains(title).should('be.visible')
    cy.contains(categoryName).should('be.visible')
  })

  it('edita un post existente', () => {
    const categoryName = uniqueName('Categoría de posts')
    const category = { id: crypto.randomUUID(), name: categoryName }
    const title = uniqueName('Post')
    mockCategories([category])
    mockPosts([category], [{ id: crypto.randomUUID(), title, content: 'Contenido original.', category }])
    cy.loginByApi('/posts')

    const newTitle = uniqueName('Post editado')
    cy.contains(title).closest('tr').within(() => cy.contains('button', 'Editar').click())
    cy.contains('Editar post').should('be.visible')
    cy.get('#title').clear().type(newTitle)
    cy.contains('button', 'Guardar').click()

    cy.contains(newTitle).should('be.visible')
  })

  it('borra un post existente', () => {
    const categoryName = uniqueName('Categoría de posts')
    const category = { id: crypto.randomUUID(), name: categoryName }
    const title = uniqueName('Post')
    mockCategories([category])
    mockPosts([category], [{ id: crypto.randomUUID(), title, content: 'Contenido original.', category }])
    cy.loginByApi('/posts')

    cy.contains(title).closest('tr').within(() => cy.contains('button', 'Borrar').click())

    cy.contains(title).should('not.exist')
  })
})
