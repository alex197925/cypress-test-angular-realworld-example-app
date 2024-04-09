/// <reference types="cypress" />

describe("Signup & Login", () => {
  let randomString = Math.random().toString(36).substring(7);
  let userName = "Auto" + randomString;
  let email = "Auto_email" + randomString + "@gmail.com";

  it("Test Valid signup", () => {
    cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");

    cy.visit("http://localhost:4200/");

    cy.get(".nav").contains("Sign up").click();
    cy.get("[placeholder='Username']").type(userName);

    cy.get("[placeholder='Email']").type(email);

    cy.get("[placeholder='Password']").type("Password1", {
      force: true,
    });
    cy.get("button").contains("Sign up").click();

    cy.wait("@newUser", {}).then(({ request, response }) => {
      cy.log("Request: " + JSON.stringify(request));
      cy.log("Response: " + JSON.stringify(response));

      expect(response.statusCode).to.be.eq(201);

      expect(request.body.user.username).to.eq(userName);
      expect(request.body.user.email).to.eq(email);
    });
  });
});
