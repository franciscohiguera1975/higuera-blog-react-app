// cypress/support/e2e.ts
// Se carga antes de cada archivo de spec (configurado en cypress.config.ts).
import './commands'
import { mockFallbacks } from './mocks/fallback'

// Se registra antes de cada test (no solo una vez por spec) porque Cypress limpia
// los intercepts entre tests. Los mocks específicos de cada entidad, al
// registrarse después dentro del test, tienen prioridad sobre este fallback.
beforeEach(() => {
  mockFallbacks()
})
