describe("Login as admin and create a question", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it("Should be logged in as admin", () => {
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get('[data-cy="admin-header"]').should("contain.text", "Dashboard");
  });

  it("Switch to create mode", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="create-mode-badge"]')
      .should("exist")
      .and("have.text", "CREATE MODE");
  });

  it("Click Add Question button in create mode in Beginner Tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
  });

  it("Click Add Question button in create mode in Intermediate Tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="level-tab-intermediate"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
  });

  it("Click Add Question button in create mode in Advanced Tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="level-tab-advanced"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
  });

  it("Create a question in Beginner Tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Vocabulary");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test vocabulary beginner text question working?"
    );
    cy.get('[data-cy="save-questions-button"]').click();
    cy.get('[data-cy="save-confirm-button"]').click();
  });
});
