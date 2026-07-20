// cypress/support/mocks/posts.ts
import { API_URL } from './api-url'
import type { MockCategory } from './categories'

export interface MockPost {
  id: string
  title: string
  content: string
  category: MockCategory
}

// Igual patrón que mockCategories: array en memoria + intercepciones CRUD. Recibe
// las categorías ya mockeadas para poder resolver `categoryId` -> `category` en las
// respuestas, igual que hace el backend real con el join.
export function mockPosts(categories: MockCategory[], initial: MockPost[] = []) {
  const posts: MockPost[] = [...initial]
  const findCategory = (id: string) => categories.find((c) => c.id === id)

  cy.intercept('GET', `${API_URL}/posts*`, (req) => {
    req.reply({ statusCode: 200, body: { success: true, message: 'OK', data: { items: posts, meta: {} } } })
  }).as('getPosts')

  cy.intercept('POST', `${API_URL}/posts`, (req) => {
    const post: MockPost = {
      id: crypto.randomUUID(),
      title: req.body.title,
      content: req.body.content,
      category: findCategory(req.body.categoryId)!,
    }
    posts.push(post)
    req.reply({ statusCode: 201, body: { success: true, message: 'Post creado', data: post } })
  }).as('createPost')

  cy.intercept('PUT', `${API_URL}/posts/*`, (req) => {
    const id = req.url.split('/').pop()
    const post = posts.find((p) => p.id === id)
    if (post) {
      post.title = req.body.title
      post.content = req.body.content
      post.category = findCategory(req.body.categoryId) ?? post.category
    }
    req.reply({ statusCode: 200, body: { success: true, message: 'Post actualizado', data: post } })
  }).as('updatePost')

  cy.intercept('DELETE', `${API_URL}/posts/*`, (req) => {
    const id = req.url.split('/').pop()
    const index = posts.findIndex((p) => p.id === id)
    if (index >= 0) posts.splice(index, 1)
    req.reply({ statusCode: 200, body: { success: true, message: 'Post eliminado', data: null } })
  }).as('deletePost')

  return posts
}
