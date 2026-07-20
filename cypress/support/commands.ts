// cypress/support/commands.ts
export interface AuthTokenResponse {
  success: boolean
  message: string
  data: { access_token: string }
}

Cypress.Commands.add('apiRegister', (username: string, email: string, password: string) => {
  return cy
    .request<AuthTokenResponse>({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/register`,
      body: { username, email, password },
    })
    .then((response) => response.body.data.access_token)
})

Cypress.Commands.add('apiLogin', (username: string, password: string) => {
  return cy
    .request<AuthTokenResponse>({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/login`,
      body: { username, password },
    })
    .then((response) => response.body.data.access_token)
})


function authStorageValue(token: string) {
  // Misma forma que persist() de Zustand guarda en localStorage bajo la key
  // "blogapp-auth" (ver src/store/auth.store.ts), decodificando el `id` del JWT como
  // hace src/lib/jwt.ts, para que la app arranque ya autenticada sin pasar por el form.
  const payload = JSON.parse(atob(token.split('.')[1])) as { id: string }
  return JSON.stringify({
    state: { token, userId: payload.id, isAuthenticated: true },
    version: 0,
  })
}

// Registra un usuario por API y visita `path` con el localStorage ya seedeado antes de
// que cargue la app (onBeforeLoad), así ProtectedRoute la deja pasar sin tocar la UI de
// login. localStorage es por origen: hay que setearlo en la carga de esta misma página,
// no antes de un cy.visit.
Cypress.Commands.add(
  'loginByApi',
  (username: string, email: string, password: string, path = '/dashboard') => {
    return cy.apiRegister(username, email, password).then((token) => {
      cy.visit(path, {
        onBeforeLoad(win) {
          win.localStorage.setItem('blogapp-auth', authStorageValue(token))
        },
      })
      return cy.wrap(token)
    })
  },
)



// Comandos de limpieza: /categories y /posts no tienen guard JWT en el backend,
// así que se puede crear/borrar directo por API sin token, dejando la base como
// estaba antes del test (no hay endpoint de reset ni seed).
Cypress.Commands.add('apiCreateCategory', (name: string) => {
  return cy
    .request<{ data: { id: string } }>({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/categories`,
      body: { name },
    })
    .then((response) => response.body.data.id)
})

Cypress.Commands.add('apiDeleteCategory', (id: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/categories/${id}`,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('apiDeletePost', (id: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/posts/${id}`,
    failOnStatusCode: false,
  })
})


declare global {
  namespace Cypress {
    interface Chainable {
      apiRegister(username: string, email: string, password: string): Chainable<string>
      apiLogin(username: string, password: string): Chainable<string>
      loginByApi(
        username: string,
        email: string,
        password: string,
        path?: string,
      ): Chainable<string>
      apiCreateCategory(name: string): Chainable<string>
      apiDeleteCategory(id: string): Chainable<unknown>
      apiDeletePost(id: string): Chainable<unknown>
    }
  }
}