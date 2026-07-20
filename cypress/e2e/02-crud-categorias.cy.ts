// cypress/e2e/02-crud-categorias.cy.ts
import { uniqueEmail, uniqueName, uniqueUsername } from '../support/utils'

describe('CRUD de Categorías', () => {
    let categoryId: string | undefined

    beforeEach(() => {
        categoryId = undefined
        cy.intercept('POST', '**/categories').as('createCategory')
        cy.loginByApi(uniqueUsername(), uniqueEmail(), 'secret123', '/categorias')
    })

    afterEach(() => {
        // No hay endpoint de reset: se borra por API lo que haya quedado creado.
        if (categoryId) cy.apiDeleteCategory(categoryId)
    })

    it('crea una categoría nueva', () => {
        const name = uniqueName('Categoría')

        cy.contains('button', 'Nueva categoría').click()
        cy.contains('Nueva categoría').should('be.visible')
        cy.get('#name').type(name)
        cy.contains('button', 'Guardar').click()

        cy.wait('@createCategory').then(({ response }) => {
            categoryId = response?.body.data.id
        })
        cy.contains('td', name).should('be.visible')
    })

    it('edita una categoría existente', () => {
        const name = uniqueName('Categoría')
        const newName = uniqueName('Categoría editada')

        cy.apiCreateCategory(name).then((id) => {
            categoryId = id
        })
        cy.reload()

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

        cy.apiCreateCategory(name).then((id) => {
            categoryId = id
        })
        cy.reload()

        cy.contains('td', name)
            .parent('tr')
            .within(() => cy.contains('button', 'Borrar').click())

        cy.contains('td', name).should('not.exist')
        categoryId = undefined
    })
})




