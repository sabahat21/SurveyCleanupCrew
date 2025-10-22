describe("Login as admin and delete questions", () => {
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const CATEGORIES = [
    "Vocabulary",
    "Grammar",
    "Culture",
    "Literature",
    "History",
  ];

  beforeEach(() => {
    cy.loginAsAdmin();
    cy.notEmpty();
  });

  it("Should be logged in as admin", () => {
    cy.url().should("eq", "http://localhost:3000/dashboard");
    cy.get('[data-cy="admin-header"]').should("contain.text", "Dashboard");
  });

  it("Edit the first question text and save changes", () => {
    cy.get('[data-cy="level-tab-beginner"]').should("exist").click();
    cy.get('[data-cy="Beginner-question-0"]').should("exist").click();
    cy.get('[data-cy="question-textarea"]')
      .should("exist")
      .clear()
      .type("Updated question text for testing purposes.");
    cy.get('[data-cy="save-changes-button"]').should("exist").click();
    cy.get('[data-cy="update-confirm-button"]').should("exist").click();
  });
});
