// cypress/e2e/00-smoke.cy.ts
describe('Home pública', () => {
  it('should render the posts/cursos tabs and the footer', () => {
    cy.visit('/')
    cy.contains('button', 'Posts').should('be.visible')
    cy.contains('button', 'Cursos').should('be.visible')
    cy.contains('BlogApp Higuera').should('be.visible')
  })
})