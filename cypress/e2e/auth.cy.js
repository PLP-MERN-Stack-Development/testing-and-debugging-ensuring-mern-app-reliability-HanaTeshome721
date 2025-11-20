describe('Authentication Flow', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/');
  });

  it('should navigate to login page', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('should display login form', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation error for empty form submission', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission
    cy.get('input[type="email"]:invalid').should('exist');
  });

  it('should allow user to type in form fields', () => {
    cy.visit('/login');
    
    cy.get('input[type="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com');
    
    cy.get('input[type="password"]')
      .type('password123')
      .should('have.value', 'password123');
  });
});

describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/');
    
    cy.contains('Posts').click();
    cy.url().should('include', '/posts');
    
    cy.contains('Home').click();
    cy.url().should('not.include', '/posts');
    
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });
});

describe('Posts Page', () => {
  it('should display posts page', () => {
    cy.visit('/posts');
    cy.contains('Posts').should('be.visible');
  });

  it('should handle loading state', () => {
    cy.visit('/posts');
    // The page should show loading or posts
    cy.get('body').should('be.visible');
  });
});

