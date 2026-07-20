// cypress/support/commands.ts
// Comando custom para "loguear" la app sin pegarle a ningún backend real: arma un
// JWT de mentira (mocks/auth.ts) y lo seedea directo en localStorage con la misma
// forma que persist() de Zustand usa (src/store/auth.store.ts), para que
// ProtectedRoute deje pasar sin pasar por el form de login.
import { fakeToken } from './mocks/auth'
import { mockUser } from './mocks/users'

function authStorageValue(token: string) {
  const payload = JSON.parse(atob(token.split('.')[1])) as { id: string }
  return JSON.stringify({
    state: { token, userId: payload.id, isAuthenticated: true },
    version: 0,
  })
}

// localStorage es por origen: hay que setearlo en la carga de esta misma página
// (onBeforeLoad), no antes de un cy.visit.
Cypress.Commands.add('loginByApi', (path = '/dashboard') => {
  const token = fakeToken()
  const { id: userId } = JSON.parse(atob(token.split('.')[1])) as { id: string }
  mockUser(userId)
  return cy
    .visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem('blogapp-auth', authStorageValue(token))
      },
    })
    .then(() => cy.wrap(token))
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(path?: string): Chainable<string>
    }
  }
}
