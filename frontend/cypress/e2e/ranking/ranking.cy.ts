describe("Ranking page (Preview → Rank → Post)", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5000");
    });
    
    it("Test core sections and buttons", () => {
        cy.contains("Actions").should("be.visible");
        cy.contains("Status").should("be.visible");
        cy.contains("Statistics").should("be.visible");
        cy.contains("Preview Ranking").should("be.visible");
        cy.contains("System Logs").should("be.visible");
        
        cy.contains("RANK").should("exist");
        cy.contains("POST").should("exist");
        cy.contains("Ready to start").should("be.visible");
        
        cy.contains("Total Answered").should("be.visible"); 
        cy.contains("Processed").should("be.visible");
        cy.contains("Answers Ranked").should("be.visible");
    
    });
    
    
    it("Preview shows rankable cards list", () => {
        cy.contains('button', 'Preview Ranking').scrollIntoView().click();

        cy.contains("Rankable", { matchCase: false, timeout: 30000 }).should("exist");
        cy.contains("Count:", { timeout: 10000 }).should("exist");
        cy.contains("Rank:", { timeout: 10000 }).should("exist");
        cy.contains("Score:", { timeout: 10000 }).should("exist");
    });
    
    
    it("Rank updates status, logs, and statistics", () => {
        cy.contains("RANK").click();
        cy.contains("Ranking completed", { timeout: 30000 }).should("be.visible");

        cy.contains("/api/test-connection: success", { timeout: 15000 }).should("exist");
        cy.contains("/api/get-questions: success", { timeout: 15000 }).should("exist");
        cy.contains("POST /api/process-ranking: success", { timeout: 15000 }).should("exist");
        cy.contains("Ranking process completed successfully", { timeout: 15000 }).should("exist");

        cy.contains("Total Answered").parent().should("not.contain", "-");
        cy.contains("Processed").parent().should("not.contain", "-");
        cy.contains("Answers Ranked").parent().should("not.contain", "-");
        });
        
        
    it("Post finalizes results and updates status + logs", () => {
    
    cy.contains("POST").click();

    cy.contains("Final operation completed!", { timeout: 30000 }).should("be.visible");
    cy.contains("Starting final endpoint operation", { timeout: 30000 }).should("exist");
    cy.contains("POST /api/post-final-answers: success", { timeout: 30000 }).should("exist");
    cy.contains("Final operation completed successfully: GET → DELETE → POST", { timeout: 30000 }).should("exist");

});

});
