// cypress/e2e/03-crud-posts.cy.ts
import { uniqueEmail, uniqueName, uniqueUsername } from '../support/utils'

describe('CRUD de Posts', () => {
  let categoryId: string
  let categoryName: string
  let postId: string | undefined

  beforeEach(() => {
    postId = undefined
    categoryName = uniqueName('Categoría de posts')
    cy.apiCreateCategory(categoryName).then((id) => {
      categoryId = id
    })
    cy.intercept('POST', '**/posts').as('createPost')
    cy.loginByApi(uniqueUsername(), uniqueEmail(), 'secret123', '/posts')
  })

  afterEach(() => {
    // Igual que en categorías: sin reset de base, se limpia por API en cada test.
    if (postId) cy.apiDeletePost(postId)
    if (categoryId) cy.apiDeleteCategory(categoryId)
  })

    it('crea un post nuevo con categoría', () => {
    const title = uniqueName('Post')

    cy.contains('button', 'Nuevo post').click()
    cy.contains('Nuevo post').should('be.visible')
    cy.get('#title').type(title)
    cy.get('#content').type('Contenido de prueba generado por Cypress.')
    cy.contains('button', 'Selecciona una categoría').click()
    cy.get('[role="option"]').contains(categoryName).click()
    cy.contains('button', 'Guardar').click()

    cy.wait('@createPost').then(({ response }) => {
      postId = response?.body.data.id
    })
    cy.contains(title).should('be.visible')
    cy.contains(categoryName).should('be.visible')
  })

    it('edita un post existente', () => {
    const title = uniqueName('Post')
    const newTitle = uniqueName('Post editado')

    cy.contains('button', 'Nuevo post').click()
    cy.get('#title').type(title)
    cy.get('#content').type('Contenido de prueba generado por Cypress.')
    cy.contains('button', 'Selecciona una categoría').click()
    cy.get('[role="option"]').contains(categoryName).click()
    cy.contains('button', 'Guardar').click()
    cy.wait('@createPost').then(({ response }) => {
      postId = response?.body.data.id
    })

    cy.contains(title).closest('tr').within(() => cy.contains('button', 'Editar').click())
    cy.contains('Editar post').should('be.visible')
    cy.get('#title').clear().type(newTitle)
    cy.contains('button', 'Guardar').click()

    cy.contains(newTitle).should('be.visible')
  })

  it('borra un post existente', () => {
    const title = uniqueName('Post')

    cy.contains('button', 'Nuevo post').click()
    cy.get('#title').type(title)
    cy.get('#content').type('Contenido de prueba generado por Cypress.')
    cy.contains('button', 'Selecciona una categoría').click()
    cy.get('[role="option"]').contains(categoryName).click()
    cy.contains('button', 'Guardar').click()
    cy.wait('@createPost').then(({ response }) => {
      postId = response?.body.data.id
    })

    cy.contains(title).closest('tr').within(() => cy.contains('button', 'Borrar').click())

    cy.contains(title).should('not.exist')
    postId = undefined
  })
})