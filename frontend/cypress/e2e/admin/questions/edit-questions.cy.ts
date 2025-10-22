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
});
