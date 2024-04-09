/// <reference types="cypress" />

describe("Signup & Login", () => {
  let randomString = Math.random().toString(36).substring(7);
  let userName = "Auto" + randomString;
  let email = "Auto_email" + randomString + "@gmail.com";
  let password = "Password1";

  beforeEach(function () {
    cy.navigateTo_Localhost_Homepage();
  });

  it("Test Valid signup", () => {
    //cy.visit("http://localhost:4200/");
    cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");

    cy.navigateTo_Localhost_Homepage();

    cy.get(".nav").contains("Sign up").click();
    cy.get("[placeholder='Username']").type(userName);

    cy.get("[placeholder='Email']").type(email);

    cy.get("[placeholder='Password']").type(password);
    cy.get("button").contains("Sign up").click();

    cy.wait("@newUser", {}).then(({ request, response }) => {
      cy.log("Request: " + JSON.stringify(request));
      cy.log("Response: " + JSON.stringify(response));

      expect(response.statusCode).to.be.eq(201);

      expect(request.body.user.username).to.eq(userName);
      expect(request.body.user.email).to.eq(email);
    });
  });

  it("Test ValidLogin & mock Popular Tags", () => {
    //cy.visit("http://localhost:4200/");
    cy.intercept("GET", "**/tags", { fixture: "popularTags.json" });
    cy.get(".nav").contains("Sign in").click();
    cy.get("[placeholder='Email']").type(email);
    cy.get("[placeholder='Password']").type(password);
    cy.get("[type='submit']").click();
    cy.get(":nth-child(4) > .nav-link").contains(userName);

    // cy.get(".tag-list").contains("JavaScript");
    // cy.get(".tag-list").contains("cypress");
    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "JavaScript ");
  });

  it.only("Mock global feed data", () => {
    cy.intercept("GET", "**/api/articles*", { fixture: "newArticle.json" }).as(
      "articles"
    );

    cy.get(".nav").contains("Sign up").click();
    cy.get("[placeholder='Username']").type(userName);
    cy.get("[placeholder='Email']").type(email);
    cy.get("[placeholder='Password']").type(password);
    cy.get("button").contains("Sign up").click();

    cy.wait("@articles");
  });
});
