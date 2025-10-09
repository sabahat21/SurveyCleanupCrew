describe("Admin login page test with no 'get' on TailwindCSS", () => {
  beforeEach(() => {
    it("passes", () => {
      cy.visit("http://localhost:3000/");
      cy.get('[data-cy="admin-tab"]').click();
    });
  });
});
