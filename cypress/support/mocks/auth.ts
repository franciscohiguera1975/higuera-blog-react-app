// cypress/support/mocks/auth.ts
import { API_URL } from './api-url'

// JWT "de mentira": src/lib/jwt.ts y src/store/auth.store.ts solo decodifican el
// payload en base64 (atob + JSON.parse) para leer el `id`, nunca verifican la
// firma - alcanza con un string con la forma header.payload.firma para que la app
// se comporte como si el login fuera real.
function base64url(value: object) {
  return btoa(JSON.stringify(value))
}

export function fakeToken(userId = crypto.randomUUID()) {
  return `${base64url({ alg: 'none' })}.${base64url({ id: userId })}.fake-signature`
}

// Mockea POST /auth/register (siempre éxito) y POST /auth/login (éxito solo si la
// contraseña coincide con `validPassword`, 401 con cualquier otra) sin pegarle a
// ningún backend real.
export function mockAuth(validPassword = 'secret123') {
  cy.intercept('POST', `${API_URL}/auth/register`, {
    statusCode: 201,
    body: { success: true, message: 'Usuario registrado', data: { access_token: fakeToken() } },
  }).as('register')

  cy.intercept('POST', `${API_URL}/auth/login`, (req) => {
    if (req.body.password === validPassword) {
      req.reply({
        statusCode: 200,
        body: { success: true, message: 'Login correcto', data: { access_token: fakeToken() } },
      })
    } else {
      req.reply({
        statusCode: 401,
        body: { success: false, message: 'Invalid credentials', data: null },
      })
    }
  }).as('login')
}
