import { answerAllFields, skipAllQuestions, skipAllQuestionsleave1 } from "../support/testFunctions";

describe('E2E Full Tests', () => {
    beforeEach(() => {
       var url = "http://localhost:3000"

    //Main Page navigation
    cy.visit(url+'/login');
    cy.get('.mt-4').click();
    cy.get('.rounded-r-lg').click();

    //Sign into admin dashboard
    // cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman');
    cy.get('[data-cy="username-input"]').type('Luqman')
    cy.get('.rounded-r-lg').click();
    // cy.get('.space-y-5 > :nth-child(2) > .w-full').type('AdminForm123')
    cy.get('[data-cy="password-input"]').type('AdminForm123')
    cy.get('.bg-purple-600').click();
    
    const apiBase = Cypress.env('apiBase');
    const apiKey = Cypress.env('apiKey');

    cy.request({
      method: 'GET',
      url: `http://localhost:8000/api/v1/admin/survey`,
      headers: {
      'x-api-key': 'H0ylHQmpyATxhhRUV3iMEfQnq1xkZl0uUGN9g26OubSw6Od5H0XwKGCMJhaY7TwL',
    },
      failOnStatusCode: false, // important for 404 handling
    }).then((res) => {
      if (res.status === 404 || !res.body.data || res.body.data.length === 0) {
      cy.log('❌ No questions found');
    // Maybe skip test or assert accordingly
    } else {
      const questions = res.body.data;
      cy.log(`✅ Found ${questions.length} questions`);
     //Delete beginner questions
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();
    }
    });

    cy.request({
      method: 'GET',
      url: `http://localhost:8000/api/v1/admin/survey`,
      headers: {
      'x-api-key': 'H0ylHQmpyATxhhRUV3iMEfQnq1xkZl0uUGN9g26OubSw6Od5H0XwKGCMJhaY7TwL',
    },
      failOnStatusCode: false, // important for 404 handling
    }).then((res) => {
      if (res.status === 404 || !res.body.data || res.body.data.length === 0) {
      cy.log('❌ No questions found');
    // Maybe skip test or assert accordingly
    } else {
      const questions = res.body.data;
      cy.log(`✅ Found ${questions.length} questions`);
      //Delete intermediete
    cy.get('.space-x-4 > :nth-child(2)').click();
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();
    }
    });
    cy.request({
      method: 'GET',
      url: `http://localhost:8000/api/v1/admin/survey`,
      headers: {
      'x-api-key': 'H0ylHQmpyATxhhRUV3iMEfQnq1xkZl0uUGN9g26OubSw6Od5H0XwKGCMJhaY7TwL',
    },
      failOnStatusCode: false, // important for 404 handling
    }).then((res) => {
      if (res.status === 404 || !res.body.data || res.body.data.length === 0) {
      cy.log('❌ No questions found');
    // Maybe skip test or assert accordingly
    } else {
      const questions = res.body.data;
      cy.log(`✅ Found ${questions.length} questions`);
    //Delete Advanced
    cy.get('.space-x-4 > :nth-child(3)').click();
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();
    }
    });
    })

    it('Test for basic creating and answering questions', () => {
    //Change url for deployed link if using deployed link
    var url = "http://localhost:3000"

    //Using the login url
    cy.visit(url+'/login');
    
    //Login into the participant page
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/form');

    cy.contains('button', 'Beginner').click();
    cy.contains('button', 'Confirm').click();
    
    //Should be blank
    cy.get('.text-gray-700')
    .should("exist")
    .should("have.text","No surveys available for Beginner level");
    
    //Go back to main page
    cy.get('.mt-4').click();

    cy.get('.rounded-r-lg').click();

    //Sign into admin dashboard
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')

    cy.get('.rounded-r-lg').click();
    cy.get('.space-y-5 > :nth-child(2) > .w-full').type('AdminForm123')
    
    //Making sure we are in dashboard
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/dashboard');

    
    //Beginner question creation
    cy.get('.from-green-500 > .relative > span').click();
    cy.get('select').first().select('Vocabulary');
    cy.get('select').last().select('Text');
    cy.get('textarea').type('Test Beginner');
    
    //Intermediate question creation
    cy.get('.space-x-4 > :nth-child(2)').click();
    cy.get('select').first().select('History');
    cy.get('select').last().select('Text');
    cy.get('textarea').type('Test Intermediate');
    
    //Advanced question creation
    cy.get('.space-x-4 > :nth-child(3)').click();
    cy.get('select').first().select('Culture');
    cy.get('select').last().select('Text');
    cy.get('textarea').type('Test Advanced');
    
    //Confirm clicks
    cy.get('.px-5').click();
    cy.get('.bg-blue-600').click();

    //Logout and goes back to home page
    cy.get('.text-red-700').click();
    cy.get('.bg-red-600').click();

    //Goes back to participant page
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/form');
    
    //Goes to beginner participant page
    cy.contains('button', 'Beginner').click();
    cy.contains('button', 'Confirm').click();

    //Will answer all the questions and go back to main page
    answerAllFields() 
    cy.get('.justify-center > .bg-gradient-to-r').click();
    cy.get('.gap-3 > .flex-1').click();
    cy.get('.px-6').click();

      cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/form');
    
    //Goes to beginner Intermediate page
    cy.contains('button', 'Intermediate').click();
    cy.contains('button', 'Confirm').click();

    //Will answer all the questions and go back to main page
    answerAllFields() 
    cy.get('.justify-center > .bg-gradient-to-r').click();
    cy.get('.gap-3 > .flex-1').click();
    cy.get('.px-6').click();

    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/form');
    
    //Goes to advanced participant page
    cy.contains('button', 'Advanced').click();
    cy.contains('button', 'Confirm').click();

    //Will answer all the questions and go back to main page
    answerAllFields() 
    cy.get('.justify-center > .bg-gradient-to-r').click();
    cy.get('.gap-3 > .flex-1').click();
    cy.get('.px-6').click();

    //Going to admin page
    cy.get('.rounded-r-lg').click();
    cy.get('.space-y-5 > :nth-child(1) > .w-full').type('Luqman')
    cy.get('.rounded-r-lg').click();
    cy.get('.space-y-5 > :nth-child(2) > .w-full').type('AdminForm123')

    //Making sure we are in dashboard
    cy.get('.bg-purple-600').click();
    cy.url().should('eq', url+'/dashboard');

    //Goes to analytics page
    cy.get('.text-indigo-700').click();
    
    //Goes to responses page
    cy.get('.gap-2 > :nth-child(2)').click();
    
    //Checks the beginner question if it works
    cy.get(':nth-child(1) > .text-purple-600 > .truncate').click();
    cy.get('.flex-1 > .text-gray-900')
    .should("exist")
    .should("have.text","this is a test");
    cy.get('.space-y-6 > :nth-child(1) > .flex > .bg-purple-600').click();

    //Checks the Intermediate question if it works
    cy.get(':nth-child(2) > .text-purple-600 > .truncate').click();
    cy.get('.flex-1 > .text-gray-900')
    .should("exist")
    .should("have.text","this is a test");
    cy.get('.space-y-6 > :nth-child(1) > .flex > .bg-purple-600').click();

    //Checks the Advanced question if it works
    cy.get(':nth-child(3) > .text-purple-600 > .truncate').click();
    cy.get('.flex-1 > .text-gray-900')
    .should("exist")
    .should("have.text","this is a test");
    cy.get('.space-y-6 > :nth-child(1) > .flex > .bg-purple-600').click();

    //Going back to delete the old questions
    cy.get('.gap-2 > :nth-child(3)').click();

    //Delete beginner questions
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();
    
    //Delete intermediete
    cy.get('.space-x-4 > :nth-child(2)').click();
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();

    //Delete Advanced
    cy.get('.space-x-4 > :nth-child(3)').click();
    cy.get('.flex.mb-4 > .items-center').click();
    cy.get('.bg-red-600').click();
  });

})
