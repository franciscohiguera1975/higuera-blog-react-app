// cypress/support/mocks/fallback.ts
import { API_URL } from './api-url'

// Red de seguridad: cualquier GET a la API que un test no mockeó explícitamente
// (ej. HomePage pidiendo /posts al redirigir tras un login o un logout) devuelve
// una lista vacía en vez de fallar con un error de red real contra un backend que
// no existe. Los mocks de cada entidad (mockCategories/mockPosts/mockAuth), al
// registrarse después en cada test, tienen prioridad sobre este fallback.
export function mockFallbacks() {
  cy.intercept('GET', `${API_URL}/**`, {
    statusCode: 200,
    body: { success: true, message: 'OK', data: { items: [], meta: {} } },
  })
}
