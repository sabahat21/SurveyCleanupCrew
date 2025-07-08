/// <reference types="cypress" />

describe('Survey Analytics Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('isAdmin', 'true');
    cy.visit('/login');
    cy.contains('Admin').click();
    cy.get('input[placeholder="Admin Name"]').type('admin');
    cy.get('input[placeholder="Password"]').type('AdminForm123');
    cy.contains('Login as Admin').click();
    cy.contains('Analytics').click();
    cy.url().should('include', '/analytics');
  });

  it('displays total response stats', () => {
    cy.contains('Total Responses').should('be.visible');
    cy.contains('Total Answered').should('be.visible');
    cy.contains('Total Skipped').should('be.visible');
    cy.contains('Overall Skip Rate').should('be.visible');
  });

  it('renders the level chart specifically', () => {
    cy.get('canvas').should('have.length', 1); 
  });

  it('has chart container wrapping charts', () => {
    cy.get('.flex.flex-col.lg\\:flex-row').should('exist');
  });

  it('displays numeric total responses', () => {
    cy.contains('Total Responses')
      .next()
      .invoke('text')
      .should('match', /^\d+$/);
  });

  it('displays most skipped questions', () => {
    cy.contains('Most Skipped Questions').should('be.visible');
    cy.get('table').should('exist');
    cy.get('thead').should('contain.text', 'Skip %');
  });

  it('refresh and back buttons work', () => {
    cy.contains('Refresh').should('be.visible').click();
    cy.contains('Back').should('be.visible').click();
    cy.url().should('include', '/dashboard');
  });

  it('redirects non-admin user from analytics page to login', () => {
    localStorage.setItem('isAdmin', 'false');
    cy.visit('/analytics');
    cy.url().should('include', '/login');
  });

  it('allows admin to access analytics directly if authenticated', () => {
    localStorage.setItem('isAdmin', 'true');
    cy.visit('/analytics');
    cy.contains('Survey Analytics Dashboard').should('exist');
  });

  it('navigates to responses page via button', () => {
    cy.contains('Responses').click();
    cy.url().should('include', '/responses');
  });

  it('refresh button triggers loading state', () => {
    cy.contains('Refresh').click();
    cy.contains('Loading analytics...').should('exist');
  });

  it('renders the page title and header icon', () => {
    cy.contains('Survey Analytics Dashboard').should('be.visible');
    cy.get('span').contains('📊').should('be.visible');
  });

  it('has working navigation buttons: Responses and Back', () => {
    cy.contains('Responses').should('exist');
    cy.contains('Back').should('exist');
  });

  it('shows level chart with canvas element', () => {
    cy.get('canvas').should('have.length', 1);
  });

  it('renders StatsOverview with all stat labels', () => {
    cy.contains('Total Responses').should('exist');
    cy.contains('Total Answered').should('exist');
    cy.contains('Total Skipped').should('exist');
    cy.contains('Overall Skip Rate').should('exist');
  });

  it('shows "Most Skipped Questions" section title', () => {
    cy.contains('Most Skipped Questions').should('be.visible');
  });

  it('renders most skipped table with headers: Question and Skip %', () => {
    cy.get('table thead').within(() => {
      cy.contains('Question').should('exist');
      cy.contains('Skip %').should('exist');
    });
  });

  it('shows proper empty state message when no questions in DB', () => {
    cy.intercept('GET', '**/api/v1/admin/survey', {
      statusCode: 200,
      body: { questions: [], answers: [] },
    }).as('getEmptyAnalytics');

    cy.visit('/analytics');
    cy.contains('No Survey Data Available').should('exist');
    cy.contains('Go to Admin Dashboard').should('exist');
  });

  it('keeps the Refresh button enabled after click', () => {
    cy.contains('Refresh').as('refreshBtn').click();
    cy.get('@refreshBtn').should('not.be.disabled');
  });

  it('renders all top-right navigation buttons', () => {
    cy.contains('Refresh').should('exist');
    cy.contains('Responses').should('exist');
    cy.contains('Back').should('exist');
  });

  it('shows loading spinner and message on initial load', () => {
    cy.intercept('GET', '**/api/v1/admin/survey', (req) => {
      req.on('response', (res) => {
        res.setDelay(1000); // 1 second delay
      });
    }).as('delayedAnalytics');

    localStorage.setItem('isAdmin', 'true');
    cy.visit('/analytics');

    cy.contains('Loading analytics...').should('be.visible');
    cy.get('.animate-spin').should('exist');
  });



});
