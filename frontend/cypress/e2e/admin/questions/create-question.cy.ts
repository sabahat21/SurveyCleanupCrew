describe("Login as admin and create a question", () => {
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const CATEGORIES = [
    "Vocabulary",
    "Grammar",
    "Culture",
    "Literature",
    "History",
  ];
  const QUESTION_TYPES = [
    { type: "Text", displayName: "Text" },
    { type: "Multiple Choice", displayName: "Multiple Choice" },
  ];

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

  LEVELS.forEach((level) => {
    it(`Click Add Question button in create mode in ${level} Tab`, () => {
      cy.get('[data-cy="add-header-button"]').should("exist").click();
      cy.get(`[data-cy="level-tab-${level.toLowerCase()}"]`)
        .should("exist")
        .click();
      cy.get('[data-cy="add-question-button"]').should("exist").click();
    });
  });

  it("Create input questions in each category in the Beginner Tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Vocabulary");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test vocabulary beginner text question working?"
    );

    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Grammar");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test grammar beginner text question working?"
    );

    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Culture");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test culture beginner text question working?"
    );

    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Literature");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test literature beginner text question working?"
    );

    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("History");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Text");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test history beginner text question working?"
    );

    cy.get('[data-cy="save-questions-button"]').click();
    cy.get('[data-cy="save-confirm-button"]').click();
  });

  it("Create MCQ questions in each category in the Beginner tab", () => {
    cy.get('[data-cy="add-header-button"]').should("exist").click();
    cy.get('[data-cy="add-question-button"]').should("exist").click();
    cy.get('[data-cy="question-category-select"]').select("Vocabulary");
    cy.get('[data-cy="question-level-select"]').select("Beginner");
    cy.get('[data-cy="question-type-select"]').select("Multiple Choice");
    cy.get('[data-cy="question-textarea"]').type(
      "Is this test vocabulary beginner MCQ question working?"
    );
    cy.get('[data-cy="mcq-option-0-input"]').type("Option 1");
    cy.get('[data-cy="mcq-option-1-input"]').type("Option 2");
    cy.get('[data-cy="mcq-option-2-input"]').type("Option 3");
    cy.get('[data-cy="mcq-option-3-input"]').type("Option 4");
    cy.get('[data-cy="mcq-correct-answer-1-button"]').click();

    cy.get('[data-cy="save-questions-button"]').click();
    cy.get('[data-cy="save-confirm-button"]').click();
  });
});
