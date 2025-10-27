

describe("Participant Login and advance Level Testing", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.visit("http://localhost:3000/login");
  });
    

  it("Should verify advance game elements load properly", () => {
    cy.get('[data-cy="username-input"]').type("advance Player");
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="proficiency-title"]', { timeout: 8000 }).should("be.visible");
    cy.get('[data-cy="advanced-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    const totalQuestions = 8;

    for (let i = 0; i < totalQuestions; i++) {
      cy.log(`Question ${i + 1}`);


if (i < 4) {

        cy.get('[data-cy="text-area"]')
          .clear()
          .type(`Example ${i + 1}`);

        cy.wait(300); 

        // Check which button is available 
        cy.get("body").then(($body) => {
          if ($body.find('[data-cy="save-continue-button"]').length > 0) {
            cy.get('[data-cy="save-continue-button"]').click();

          } else if ($body.find('[data-cy="review-answers-button"]').length > 0) {
             cy.get('[data-cy="review-answers-button"]').click();

          } 
          else {
            cy.log("No save and review button found");
          }
        });
      } else {

        cy.get('[data-cy="skip-button"]', { timeout: 1000 }).click();

      }
     cy.wait(500);
    }

        cy.get('[data-cy="submit-survey"]').click();

  });
});
