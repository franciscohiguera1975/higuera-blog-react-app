// cypress/support/mocks/categories.ts
import { API_URL } from './api-url'

export interface MockCategory {
  id: string
  name: string
}

// Mock en memoria de /categories (GET/POST/PUT/DELETE), mismo espíritu que los
// handlers de MSW del tutorial de Vitest: un array que vive mientras dura el test
// y que las intercepciones leen/escriben, sin pegarle a ningún backend real.
export function mockCategories(initial: MockCategory[] = []) {
  const categories: MockCategory[] = [...initial]

  cy.intercept('GET', `${API_URL}/categories*`, (req) => {
    req.reply({ statusCode: 200, body: { success: true, message: 'OK', data: { items: categories, meta: {} } } })
  }).as('getCategories')

  cy.intercept('POST', `${API_URL}/categories`, (req) => {
    const category: MockCategory = { id: crypto.randomUUID(), name: req.body.name }
    categories.push(category)
    req.reply({ statusCode: 201, body: { success: true, message: 'Categoría creada', data: category } })
  }).as('createCategory')

  cy.intercept('PUT', `${API_URL}/categories/*`, (req) => {
    const id = req.url.split('/').pop()
    const category = categories.find((c) => c.id === id)
    if (category) category.name = req.body.name
    req.reply({ statusCode: 200, body: { success: true, message: 'Categoría actualizada', data: category } })
  }).as('updateCategory')

  cy.intercept('DELETE', `${API_URL}/categories/*`, (req) => {
    const id = req.url.split('/').pop()
    const index = categories.findIndex((c) => c.id === id)
    if (index >= 0) categories.splice(index, 1)
    req.reply({ statusCode: 200, body: { success: true, message: 'Categoría eliminada', data: null } })
  }).as('deleteCategory')

  return categories
}
