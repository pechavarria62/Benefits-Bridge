describe('Benefits Bridge', () => {

  it('loads the home page', () => {

    cy.visit('/dashboard');
    
    cy.contains('Welcome to Benefits Bridge').should('be.visible');

    cy.get('input[placeholder="Enter City"]')
      .should('be.visible');

    cy.get('input[placeholder="Enter State"]')
      .should('be.visible');

    cy.contains('button', 'Continue')
      .should('be.visible');




  })
})