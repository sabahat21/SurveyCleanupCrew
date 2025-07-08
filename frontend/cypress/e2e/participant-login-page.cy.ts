describe('Partipant Login Page', () => {
   beforeEach(() => {
  cy.visit('http://localhost:3000/login');
})

  it('Test Participant Tab', () => {
    cy.get('.rounded-l-lg')
    .should("exist")
    .should("have.text","Participant");
});
  it('Test Admin Tab', () => {
    cy.get('.rounded-r-lg')
    .should("exist")
    .should("have.text","Admin");
});
  it('Test Particpant Login Should Exist', () => {
    cy.get('.text-2xl')
    .should("exist")
    .should("have.text","Participant Login");
});
  
  it('Test Anonymous Text', () => {
    cy.get('.text-sm')
    .should("exist")
    .should("have.text","Anonymous");
});

  it('Test Anonymous Text Checkbox', () => {
  cy.get('.mr-2').click();
  cy.get('input[type="checkbox"]').should('be.checked');

  cy.get('.mr-2').click();
  cy.get('input[type="checkbox"]').should('not.be.checked');
});

  it('Test Anonymous Login', () => {
  cy.get('.mr-2').click();
  cy.get('input[type="checkbox"]').should('be.checked');

  cy.get('.bg-purple-600').click();
  cy.url().should('eq', 'http://localhost:3000/form');
});
  
  it('Test Login as Participant Button', () => {
    cy.get('.bg-purple-600')
    .should("exist")
    .should("have.text","Login as Participant");
});

  it('Test Login as Participant Button Error With No Name Input', () => {
    cy.get('.bg-purple-600').click();
    cy.contains('Please enter your name or login as Anonymous.').should('be.visible');
});

  it('Test Login as Participant Button Event Click With Name', () => {
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', 'http://localhost:3000/form');
});

it('Test Sanskrit Learning Survey Text', () => {
    cy.get('.text-xs')
    .should("exist")
    .should("have.text","Welcome to Sanskrit Learning Survey!");
});
})