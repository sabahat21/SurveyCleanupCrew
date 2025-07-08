// cypress/e2e/support/surveyHelpers.ts

export function skipAllQuestions() {
 cy.get('[data-testid="progress-count"]')
  .invoke('text')
  .then((text) => {
    const total = Number(text.match(/of (\d+)/)?.[1] || 0);

    for (let i = 0; i < total; i++) {
      cy.contains('button', 'Skip Question').click();
    }
  });

}

export function skipAllQuestionsleave1() {
 cy.get('[data-testid="progress-count"]')
  .invoke('text')
  .then((text) => {
    const total = Number(text.match(/of (\d+)/)?.[1] || 0);

    for (let i = 0; i < total-1; i++) {
      cy.contains('button', 'Skip Question').click();
    }
  });

}
export function answerAllFields() {
 cy.get('[data-testid="progress-count"]')
  .invoke('text')
  .then((text) => {
    const total = Number(text.match(/of (\d+)/)?.[1] || 0);

    for (let i = 0; i < total; i++) {
      cy.get('.bg-white\\/90 > .mb-6 > .w-full')
      .clear()
      .type('This is a test');
      
      if(i != total - 1){
        cy.contains('button', 'Save & Continue').click();
      }
    }
  });

}

