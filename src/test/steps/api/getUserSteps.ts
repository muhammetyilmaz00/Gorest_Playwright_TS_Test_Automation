import { When, Then } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { hooks } from "../../setup/hooks";
import { APIContext, URLS, apiResponse } from "../../../../support/apiContext";

let apiContext = new APIContext(true);
let apiContextUnauthorized = new APIContext(false);

When("I request to get all users", async () => {
  console.log("I request to get all users");
  await apiContext.get(URLS.USERS);
});

Then("the response status code should be {int}", async (statusCode: number) => {
  console.log("the response status code should be " + statusCode);
  expect(apiResponse.status()).toEqual(statusCode);
});

Then("the response users must have the following fields", async (table: any) => {
  console.log("the response users must have the following fields: " + JSON.stringify(table.hashes()[0]));
  const fields = table.raw().flat();
  const requestBody = JSON.parse(await apiResponse.text());

  requestBody.forEach((json: any) => {
    fields.forEach((field: any) => {
      expect(json).toHaveProperty(field);
    });
  });
});

When("I request to get single user with id {int}", async (id: number) => {
  console.log("I request to get single user with id " + id);
  await apiContext.get(URLS.USERS + id);
});

Then("the response user id must be {int}", async (id: number) => {
  console.log("the response user id must be " + id);
  const responseBody = JSON.parse(await apiResponse.text());
  expect(responseBody.id).toEqual(id);
});

When('I request to get the newly created user with {string}', async (field: string) => {
  console.log("I request to get the newly created user with " + field);
  if (field === "id") {
    await apiContext.get(URLS.USERS + hooks.context.get("userId"));
  } else if (field === "name") {
    await apiContext.get(URLS.USERS + "?name=" + hooks.context.get("userName"));
  }
})

When('I request to get all users on page {int} with {int} users per page', async (page: number, perPage: number) => {
  console.log("I request to get all users on page " + page + " with " + perPage + " users per page");
  await apiContext.get(URLS.USERS + "?page=" + page + "&per_page=" + perPage);
});

Then('the response must contain exactly {int} users', async (result: number) => {
  console.log("the response must contain exactly " + result + " users");
  const responseBody = JSON.parse(await apiResponse.text());
  expect(responseBody.length).toEqual(result);
});

Then('the response headers must contain pagination information {string}', async (limit: string) => {
  console.log("the response headers must contain pagination information " + limit);
  const headers = apiResponse.headers();
  expect(headers['x-pagination-limit']).toEqual(limit);
  expect(headers['x-pagination-page']).toEqual("1");
});
When('I request to get a user with id {int} with no authentication', async (int: number) => {
  console.log("I request to get a user with id " + int + " with no authentication")
  await apiContextUnauthorized.get(URLS.USERS + int);
})

When('I request to get a user with a non-numeric id {string}', async (s: string) => {
  console.log("I request to get a user with a non-numeric id " + s);
  await apiContext.get(URLS.USERS + s);
})
