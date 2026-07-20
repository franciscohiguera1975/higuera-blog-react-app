// cypress/support/mocks/users.ts
import { API_URL } from './api-url'

// DashboardHeader pide GET /users/:id apenas monta (para mostrar el username/avatar
// del usuario logueado). Es un recurso único, no una lista paginada, así que el
// fallback genérico de mocks/fallback.ts no sirve acá: hace falta un objeto `User`
// real para que `user?.username.slice(...)` no explote.
export function mockUser(userId: string, username = 'cy-user') {
  cy.intercept('GET', `${API_URL}/users/${userId}`, {
    statusCode: 200,
    body: {
      success: true,
      message: 'OK',
      data: { id: userId, username, email: `${username}@example.com`, isActive: true },
    },
  }).as('getUser')
}
