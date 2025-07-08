describe('Admin Login Page', () => {
  beforeEach(() => {
  cy.visit('http://localhost:3000/login');
  cy.get('.rounded-r-lg').click();
})

  it('Test Participant Tab', () => {
    cy.get('.rounded-l-lg')
    .should("exist")
    .should("have.text","Participant");
});
  it('Test Admin Login tab shows Admin Login content', () => {
   cy.get('.text-2xl')
   .should('exist')
   .should('have.text', 'Admin Login');
});

   it('Test Login as Admin Button', () => {
    cy.get('.bg-purple-600')
    .should("exist")
    .should("have.text","Login as Admin");
});

   it('Test Login as Admin Button Error With No Name or Password Input', () => {
    cy.get('.bg-purple-600').click();
    cy.contains('Please enter admin name.').should('be.visible');
});

   it('Test Login as Admin Button Error With No Password Input', () => {
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')

    cy.get('.bg-purple-600').click();
    cy.contains('Please enter password.').should('be.visible');
});

  it('Test Login as Admin Button Error With No Name Input', () => {
    cy.get('.space-y-5 > :nth-child(2) > .w-full').type('Dummy Password')

    cy.get('.bg-purple-600').click();
    cy.contains('Please enter admin name.').should('be.visible');
});

  it('Test With Incorrect Password', () => {
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')

    cy.get('.rounded-r-lg').click();
    cy.get('.space-y-5 > :nth-child(2) > .w-full').type('Dummy Password')

    cy.get('.bg-purple-600').click();
    cy.contains('Incorrect admin password.').should('be.visible');
});

  it('Test With Correct Password', () => {
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')

    cy.get('.rounded-r-lg').click();
    cy.get('.space-y-5 > :nth-child(2) > .w-full').type('AdminForm123')

    cy.get('.bg-purple-600').click();
    cy.url().should('eq', 'http://localhost:3000/dashboard');
});

  it('Test Sanskrit Learning Survey Text', () => {
    cy.get('.text-xs')
    .should("exist")
    .should("have.text","Welcome to Sanskrit Learning Survey!");
});
})