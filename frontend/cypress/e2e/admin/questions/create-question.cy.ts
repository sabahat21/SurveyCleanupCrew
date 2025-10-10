describe("Login as admin and create a question", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("Should be logged in as admin", () => {
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });

  it("Switch to create mode", () => {
    cy.get('[data-cy="add-header-button"]').click();
    cy.get('[data-cy="create-mode-badge"]')
      .should("exist")
      .and("have.text", "CREATE MODE");
  });

  it("Click Add Question button in create mode in Beginner Tab", () => {
    cy.get('[data-cy="add-header-button"]').click();
    cy.get('[data-cy="add-question-button"]').click();
  });

  it("Click Add Question button in create mode in Intermediate Tab", () => {
    cy.get('[data-cy="add-header-button"]').click();
    cy.get('[data-cy="level-tab-intermediate"]').click();
    cy.get('[data-cy="add-question-button"]').click();
  });

  it("Click Add Question button in create mode in Advanced Tab", () => {
    cy.get('[data-cy="add-header-button"]').click();
    cy.get('[data-cy="level-tab-advanced"]').click();
    cy.get('[data-cy="add-question-button"]').click();
  });
});
