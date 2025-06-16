describe('Admin Login Page', () => {
  beforeEach(() => {
    cy.visit('/login'); 
    cy.contains('Admin').click(); 
  });

  it('renders admin login form', () => {
    cy.get('input[placeholder="Admin Name"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.contains('Login as Admin').should('exist');
  });

  it('accepts admin input and logs in successfully', () => {
    cy.get('input[placeholder="Admin Name"]').type('admin');
    cy.get('input[placeholder="Password"]').type('AdminForm123');
    cy.contains('Login as Admin').click();

    cy.url().should('include', '/dashboard'); 
  });

  it('shows error message on wrong login', () => {
    cy.get('input[placeholder="Admin Name"]').type('wrongadmin');
    cy.get('input[placeholder="Password"]').type('wrongpass');
    cy.contains('Login as Admin').click();

    cy.contains('Incorrect admin password.').should('be.visible');
  });
});
