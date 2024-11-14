import { When, Then } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { hooks } from "../../setup/hooks";
import { APIContext, URLS, apiResponse } from "../../../../support/apiContext";

let apiContext = new APIContext(true);

When("I request to create a new user with the following details", async (table: any) => {
  console.log("I request to create a new user with the following details: " + JSON.stringify(table.hashes()[0]));
  const userDetails = table.hashes()[0];
  const requestBody = {
    name: userDetails.name,
    gender: userDetails.gender,
    email: userDetails.email,
    status: userDetails.status,
  };

  await apiContext.post(URLS.USERS, requestBody);

  // Extract and store the ID of the newly created user.
  const id = JSON.parse(await apiResponse.text()).id;
  hooks.context.save("userId", id);
  hooks.context.save("userName", userDetails.name);
});

Then("the response must contain the user details", async (table: any) => {
  console.log("the response must contain the user details: " + JSON.stringify(table.hashes()[0]));
  const userDetails = table.hashes()[0];

  // Validate that the response user matches the expected details.
  await apiResponse.body().then((user: any) => {
    user.name = userDetails.name;
    user.gender = userDetails.gender;
    user.email = userDetails.email;
    user.status = userDetails.status;
  });
});

When('I request to create a new user with the invalid details', async (table: any) => {
  console.log("I request to create a new user with the invalid details: " + JSON.stringify(table.hashes()[0]));
  const userDetails = table.hashes()[0];
  const requestBody = {
    name: userDetails.name,
    gender: userDetails.gender,
    email: userDetails.email,
    status: userDetails.status,
  };
  await apiContext.post(URLS.USERS, requestBody);
});

Then('the response must contain an error message {string} indicating field {string} is missing', async (errorMessage: string, field: string) => {
  console.log("the response must contain an error message " + errorMessage + " indicating field " + field + " is missing");
  const responseBody = JSON.parse(await apiResponse.text());
  expect(responseBody[0].message).toEqual(errorMessage);
  expect(responseBody[0].field).toEqual(field);
})


