/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>;
      notEmpty(): Chainable<void>;
      // login(email: string, password: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add("loginAsAdmin", () => {
  cy.session("admin-login", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('[data-cy="admin-tab"]').click();
    cy.get('[data-cy="username-input"]').type("Jimmy");
    cy.get('[data-cy="password-input"]').type("AdminForm123");
    cy.get('[data-cy="login-button"]').click();
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });

  // Always visit dashboard after session
  cy.visit("http://localhost:3000/dashboard");
});

Cypress.Commands.add("notEmpty", () => {
  cy.wait(2000);
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="empty-add-beginner-button"]').length > 0) {
      cy.log(
        "Empty state detected, creating initial question to enable dashboard..."
      );
      cy.get('[data-cy="empty-add-beginner-button"]').click();
      cy.get('[data-cy="add-question-button"]').should("exist").click();
      cy.get('[data-cy="question-category-select"]').select("Vocabulary");
      cy.get('[data-cy="question-level-select"]').select("Beginner");
      cy.get('[data-cy="question-type-select"]').select("Text");
      cy.get('[data-cy="question-textarea"]').type("Initial setup question");
      cy.get('[data-cy="save-questions-button"]').click();
      cy.get('[data-cy="save-confirm-button"]').click();
      cy.url().should("eq", "http://localhost:3000/dashboard");
    }
  });
});

export {};
