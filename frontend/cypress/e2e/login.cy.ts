describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login'); 
  });

  it('renders login form', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('accepts user input', () => {
    cy.get('input[name="email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[name="password"]').type('password123').should('have.value', 'password123');
  });

  it('shows error for invalid login', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email or password').should('be.visible'); // Adjust this based on your app
  });

  it('redirects on successful login', () => {
    cy.get('input[name="email"]').type('validuser@example.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard'); // or whatever page comes after login
  });
});
