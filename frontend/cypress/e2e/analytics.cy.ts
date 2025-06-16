describe('Survey Analytics Dashboard', () => {
  beforeEach(() => {
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

  it('renders charts', () => {
    // Bar chart: Questions per Category
    cy.get('canvas').should('exist'); // If you're using Chart.js or similar

    // Pie chart for levels
    cy.get('canvas').should('have.length.at.least', 2); // Expecting both charts
  });

  it('renders leaderboard questions', () => {
    cy.contains('Leaderboard - Top 5 Answered Questions').should('be.visible');
    cy.get('ul li').should('have.length.at.least', 1);
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

  it('goes back to dashboard when back button is clicked', () => {
    cy.contains('Back').click();
    cy.url().should('include', '/dashboard');
  });

  it('refresh button updates content', () => {
    cy.contains('Refresh').click();
    cy.contains('Loading analytics...').should('exist');
  });
  
 it('renders bar and pie charts', () => {
  cy.get('canvas').should('have.length.at.least', 2);
 });

 it('renders the category chart specifically', () => {
  cy.get('canvas').eq(0).should('exist');
 });

 it('renders the level chart specifically', () => {
  cy.get('canvas').eq(1).should('exist');
});

it('has chart container wrapping charts', () => {
  cy.get('.flex.flex-col.lg\\:flex-row').should('exist');
});

it('displays numeric total responses', () => {
  cy.contains('Total Responses').next().invoke('text').should('match', /^\d+$/);
});

it('shows top 5 questions in leaderboard', () => {
  cy.get('ul li').should('have.length.lte', 5);
});

it('each leaderboard item contains a question', () => {
  cy.get('ul li').each(($el) => {
    cy.wrap($el).find('span').first().invoke('text').should('not.be.empty');
  });
});

it('each leaderboard item contains response count', () => {
  cy.get('ul li').each(($el) => {
    cy.wrap($el).find('span').eq(1).invoke('text').should('match', /\d+ answers/);
  });
});

it('displays leaderboard section title', () => {
  cy.contains('Leaderboard - Top 5 Answered Questions').should('be.visible');
});

it('updates leaderboard after refresh click', () => {
  cy.contains('Refresh').click();
  cy.contains('p', 'Total Responses').should('exist');
});


});
