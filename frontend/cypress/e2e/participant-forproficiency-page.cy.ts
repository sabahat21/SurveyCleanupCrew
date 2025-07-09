describe('Participant Proficiency Page', () => {
 beforeEach(() => {
  cy.visit('http://localhost:3000/form');
})

  it('Test Beginner Tab', () => {
    cy.contains('button', 'Beginner')
    .should("exist")
    .should("have.text","Beginner");
});

  it('Test Intermediate Tab', () => {
    cy.contains('button', 'Intermediate')
    .should("exist")
    .should("have.text","Intermediate");
});

  it('Test Advanced Tab', () => {
    cy.contains('button', 'Advanced')
    .should("exist")
    .should("have.text","Advanced");
});
  it('Test Confirm', () => {
    cy.contains('button', 'Confirm')
    .should("exist")
    .should("have.text","Confirm");
});
  it('Test Confirm Button not pressable', () => {
    cy.contains('button', 'Confirm').should('be.disabled');
});

  it('Test Beginner Tab Click', () => {
    cy.contains('button', 'Beginner').click();
    cy.contains('button', 'Confirm').click();
});
  it('Test Intermediate Tab Click', () => {
    cy.contains('button', 'Intermediate').click();
    cy.contains('button', 'Confirm').click();

});
  it('Test Advanced Tab Click', () => {
    cy.contains('button', 'Advanced').click();
    cy.contains('button', 'Confirm').click();

});

})
