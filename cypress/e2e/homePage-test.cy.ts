describe('cypress render test', () => {
  it('renders the title with correct text', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="cyp-title"]')
      .should('exist')
      .should('have.text', 'Welcome to CRYPTO KNIGHT');
  });

  it('should display top 10 coins list', () => {
    cy.visit('http://localhost:3000/');
    
    cy.get('[aria-label="crypto coin table"]').should('exist');
    cy.get('[data-testid="coin-row"]').should('have.length', 10);

  });

  it('should filter and display coins based on user search input', () => {
        // Navigate to page if needed
        cy.visit('http://localhost:3000/');
    
        // Interaction with input
        cy.get('input[placeholder="Enter your Crypto"]')
          .clear()
          .type('Avalanche', { delay: 100 }) 
          .should('have.value', 'Avalanche');
    
        // Interaction with search button
        cy.get('button[aria-label="coin search button"]')
          .should('be.visible')
          .click();
    
        // verify search results
        cy.get('[aria-label="crypto coin table"]')
        .should('contain', 'Avalanche')
        .and('not.contain', 'Ethereum');
 
  });
  it('should click on portlio link and go to portfolio page', () => {
    cy.visit('http://localhost:3000/');

    cy.get('a[aria-label="Go to portfolio page"]').click();

    cy.url().should('include', '/portfolio')
    cy.get('[data-testid="portfolio-title"]')
    .should('exist')
    .should('have.text', 'MY PORTFOLIO');
  });
});
