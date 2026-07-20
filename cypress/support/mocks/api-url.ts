// cypress/support/mocks/api-url.ts
// Los mocks matchean por origen absoluto (no `**/categories*`) porque el frontend
// tiene rutas propias con el mismo nombre que algunos endpoints (ej. `/posts`), y
// un patrón "cualquier origen" terminaría interceptando también la navegación de
// cy.visit a esas páginas, no solo las llamadas a la API.
export const API_URL = 'http://localhost:3000'
