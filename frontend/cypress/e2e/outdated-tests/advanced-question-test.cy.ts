import e from "express";
import {
  answerAllFields,
  skipAllQuestions,
  skipAllQuestionsleave1,
} from "../../support/testFunctions";

describe("Advance Question Quiz Page", () => {
  before(() => {
    var url = "http://localhost:3000";
    const apiBase = Cypress.env("apiBase");
    const apiKey = Cypress.env("apiKey");

    cy.request({
      method: "GET",
      url: `http://localhost:8000/api/v1/admin/survey`,
      headers: {
        "x-api-key":
          "H0ylHQmpyATxhhRUV3iMEfQnq1xkZl0uUGN9g26OubSw6Od5H0XwKGCMJhaY7TwL",
      },
      failOnStatusCode: false, // important for 404 handling
    }).then((res) => {
      if (res.status === 404 || !res.body.data || res.body.data.length === 0) {
        cy.log("❌ No questions found");
        //Main Page navigation
        cy.visit(url + "/login");
        cy.get(".mt-4").click();
        cy.get(".rounded-r-lg").click();

        //Sign into admin dashboard
        cy.get(".space-y-5 > :nth-child(1) > .w-full").type("Luqman");
        cy.get(".rounded-r-lg").click();
        cy.get(".space-y-5 > :nth-child(2) > .w-full").type("AdminForm123");
        cy.get(".bg-purple-600").click();

        cy.get(".from-green-500 > .relative > span").click();
        cy.get("select").first().select("Vocabulary");
        cy.get("select").last().select("Text");
        cy.get("textarea").type("Test Beginner");

        cy.get("select").first().select("Vocabulary");
        cy.get("select").last().select("Text");
        cy.get("textarea").type("Test Beginner2");

        //Confirm clicks
        cy.get(".px-5").click();
        cy.get(".bg-blue-600").click();

        //Logout and goes back to home page
        cy.get(".text-red-700").click();
        cy.get(".bg-red-600").click();
      } else {
        const questions = res.body.data;
        cy.log(`✅ Found ${questions.length} questions`);
      }
    });

    cy.visit(url + "/login");
    cy.get(".mt-4").click();
    cy.get(".rounded-r-lg").click();

    //Sign into admin dashboard
    cy.get(".space-y-5 > :nth-child(1) > .w-full").type("Luqman");
    cy.get(".rounded-r-lg").click();
    cy.get(".space-y-5 > :nth-child(2) > .w-full").type("AdminForm123");
    cy.get(".bg-purple-600").click();
    cy.get(".justify-between > :nth-child(2) > .bg-white").click();

    cy.get(".space-x-4 > :nth-child(3)").click();
    cy.get("select").first().select("History");
    cy.get("select").last().select("Text");
    cy.get("textarea").type("Test Advanced");

    cy.get(".mt-4 > .w-full").click();

    cy.get("select").first().select("History");
    cy.get("select").last().select("Text");
    cy.get("textarea").type("Test Advanced 2");

    //Confirm clicks
    cy.get(".px-5").click();
    cy.get(".bg-blue-600").click();

    //Logout and goes back to home page
    cy.get(".text-red-700").click();
    cy.get(".bg-red-600").click();
  });
  beforeEach(() => {
    cy.visit("http://localhost:3000/form");
    cy.contains("button", "Advanced").click();
    cy.contains("button", "Confirm").click();
  });

  it("Test Advanced Level Text", () => {
    cy.get(".justify-between > .px-4")
      .should("exist")
      .should("have.text", "Advanced Level");
  });

  it("Test Logout Text", () => {
    cy.get(".text-red-500").should("exist").should("have.text", "Logout");
  });

  it("Test Question 1 Text", () => {
    cy.get(".bg-gradient-to-r > .gap-3 > .font-medium")
      .should("exist")
      .should("have.text", "Question 1");
  });

  it("Test Question 1 icon", () => {
    cy.get(".bg-gradient-to-r > .gap-3 > .w-8")
      .should("exist")
      .should("have.text", "1");
  });

  it("Test Questions text", () => {
    cy.get(".mb-4 > .text-sm").should("exist").should("have.text", "Questions");
  });

  it("Test Survey Progress text", () => {
    cy.get(".text-xl").should("exist").should("have.text", "Survey Progress");
  });

  it("Test Survey Progress text", () => {
    cy.get(".text-xl").should("exist").should("have.text", "Survey Progress");
  });

  it("Test Save & Continue Text", () => {
    cy.contains("button", "Save & Continue")
      .should("exist")
      .should("have.text", "Save & Continue");
  });

  it("Test Skip Question Text", () => {
    cy.contains("button", "Skip Question")
      .should("exist")
      .should("have.text", "Skip Question");
  });

  it("Test Logout button", () => {
    cy.contains("button", "Logout").click();

    cy.contains("button", "Yes, Logout")
      .should("exist")
      .should("have.text", "Yes, Logout");
  });

  it("Test Cancel Button", () => {
    cy.contains("button", "Logout").click();

    cy.contains("button", "Cancel")
      .should("exist")
      .should("have.text", "Cancel");
  });

  it("Test Logout are you sure you want to logout Text", () => {
    cy.contains("button", "Logout").click();

    cy.get(".bg-white > .mb-6")
      .should("exist")
      .should("have.text", "Are you sure you want to logout?");
  });

  it("Test Logout button logout? Text", () => {
    cy.contains("button", "Logout").click();

    cy.get(".bg-white > .text-xl")
      .should("exist")
      .should("have.text", "Logout?");
  });

  it("Test Logout button Confirm Redirection", () => {
    cy.contains("button", "Logout").click();

    cy.contains("button", "Yes, Logout")
      .should("exist")
      .should("have.text", "Yes, Logout");

    cy.contains("button", "Yes, Logout").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  it("Test Logout button Cancel Redirection", () => {
    cy.contains("button", "Logout").click();

    cy.contains("button", "Yes, Logout")
      .should("exist")
      .should("have.text", "Yes, Logout");

    cy.contains("button", "Cancel").click();
    cy.url().should("eq", "http://localhost:3000/form");
  });

  it("Test Skipping question changes skip question to unskip", () => {
    cy.contains("button", "Skip Question").click();

    cy.get(".space-y-2 > :nth-child(1)").click();

    cy.contains("button", "Unskip Question")
      .should("exist")
      .should("have.text", "Unskip Question");
  });

  it("Test Skipping question login when unskipped", () => {
    cy.contains("button", "Skip Question").click();

    cy.get(".space-y-2 > :nth-child(1)").click();
    cy.contains("button", "Unskip Question").click();

    cy.get(".space-y-2 > :nth-child(1)").click();
    cy.contains("button", "Skip Question")
      .should("exist")
      .should("have.text", "Skip Question");
  });

  it("Test for saving answer upon going to another", () => {
    cy.get(".bg-white\\/90 > .mb-6 > .w-full").clear().type("This is a test");

    cy.get(".space-y-2 > :nth-child(2)").click();
    cy.get(".space-y-2 > :nth-child(1)").click();

    cy.get(".bg-white\\/90 > .mb-6 > .w-full")
      .should("exist")
      .should("have.value", "This is a test");
  });

  it("Test Progress bar text", () => {
    cy.get(".bg-white\\/90 > .mb-6 > .w-full").clear().type("This is a test");

    cy.get(".space-y-2 > :nth-child(2)").click();

    cy.get(".mb-6 > .text-sm").should("exist").should("include.text", "1");
  });

  it("Test Progress bar text with no completion", () => {
    cy.get(".mb-6 > .text-sm").should("exist").should("include.text", "0");
  });

  it("Test Save & Continue Error Message", () => {
    cy.contains("button", "Save & Continue").click();

    cy.contains("Please answer the question or click Skip.").should(
      "be.visible"
    );
  });

  it("Test Last question text with review Answers", () => {
    cy.contains("button", "Save & Continue").click();

    skipAllQuestionsleave1();

    cy.get(".justify-center > .bg-gradient-to-r")
      .should("exist")
      .should("have.text", "Review Answers");
  });

  it("Test Skip all question displays survey result", () => {
    skipAllQuestions();

    cy.get(".text-lg").should("have.text", "Survey Complete!");
  });

  it("Test Skip all question displays survey result", () => {
    skipAllQuestions();

    cy.get(".relative > .px-4").should("have.text", "SURVEY Level");
  });

  it("Test Logout are you sure you want to logout Text end result screen", () => {
    skipAllQuestions();

    cy.contains("button", "Logout").click();

    cy.get(".bg-white > .mb-6")
      .should("exist")
      .should("have.text", "Are you sure you want to logout?");
  });

  it("Test Logout button logout? Text end result screen", () => {
    skipAllQuestions();

    cy.contains("button", "Logout").click();

    cy.get(".bg-white > .text-xl")
      .should("exist")
      .should("have.text", "Logout?");
  });

  it("Test Logout button Confirm Redirection end result screen", () => {
    skipAllQuestions();

    cy.contains("button", "Logout").click();

    cy.contains("button", "Yes, Logout")
      .should("exist")
      .should("have.text", "Yes, Logout");

    cy.contains("button", "Yes, Logout").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  it("Test Logout button Cancel Redirection end result screen", () => {
    skipAllQuestions();

    cy.contains("button", "Logout").click();

    cy.contains("button", "Yes, Logout")
      .should("exist")
      .should("have.text", "Yes, Logout");

    cy.contains("button", "Cancel").click();
    cy.url().should("eq", "http://localhost:3000/form");
  });

  it("Test Review More button after all skipped", () => {
    skipAllQuestions();

    cy.contains("button", "Review More").click();

    cy.get(".justify-center > .bg-gradient-to-r")
      .should("exist")
      .should("have.text", "Review Answers");
  });

  it("Test Leave all but one left and try to submit", () => {
    skipAllQuestionsleave1();

    cy.contains("button", "Review Answers").click();

    cy.contains("Please answer the question or click Skip.").should(
      "be.visible"
    );
  });

  it("Test submission answer OK button", () => {
    answerAllFields();

    cy.contains("button", "Review Answers").click();

    cy.contains("button", "Submit Survey").click();

    cy.get(".px-6").should("exist").should("have.text", "OK");
  });
  it("Test submission answer OK button click", () => {
    skipAllQuestions();

    cy.contains("button", "Submit Survey").click();

    cy.get(".px-6").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  it("Test submission answer Success text", () => {
    skipAllQuestions();

    cy.contains("button", "Submit Survey").click();

    cy.get(".bg-white > .text-xl")
      .should("exist")
      .should("have.text", "Success!");
  });

  it("Test submission answer Survey Success text", () => {
    skipAllQuestions();

    cy.contains("button", "Submit Survey").click();

    cy.get(".bg-white > .mb-6")
      .should("exist")
      .should(
        "have.text",
        "Survey submitted successfully! Thank you for your participation."
      );
  });
  it("Test if answer is properly displayed at the survey complete screen", () => {
    cy.get(".bg-white\\/90 > .mb-6 > .w-full").clear().type("This is a test");
    cy.contains("button", "Save & Continue").click();
    skipAllQuestionsleave1();

    cy.get(".max-h-48 > :nth-child(1) > .text-gray-600")
      .should("exist")
      .should("have.text", "This is a test");
  });
});
