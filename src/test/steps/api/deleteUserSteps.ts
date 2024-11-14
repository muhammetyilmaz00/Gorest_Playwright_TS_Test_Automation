import { When, Then } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { hooks } from "../../setup/hooks";
import { APIContext, URLS, apiResponse } from "../../../../support/apiContext";

let apiContext = new APIContext(true);
let apiContextUnauthorized = new APIContext(false);

When("I request to delete the user", async () => {
  console.log("I request to delete the user");
  await apiContext.delete(URLS.USERS + hooks.context.get("userId"));
});

When("I request to delete the user with id {string}", async (invalid_id: string) => {
  console.log("I request to delete the user with id " + invalid_id);
  await apiContext.delete(URLS.USERS + invalid_id);
  hooks.context.save("userId", invalid_id);
});

Then("the response must have a {string} message", async (messageType: string) => {
  console.log("the response must have a message");
  const responseBody = JSON.parse(await apiResponse.text());

  if (messageType === "error") {
    expect(responseBody.message).toEqual("Resource not found");
  } else if (messageType === "message") {
    expect(responseBody.message).toEqual("Invalid token");
  } else {
    throw new Error(`Unsupported message type: ${messageType}`);
  }
});

When('I request to delete the user without authentication', async () => {
  console.log("I request to delete the user without authentication");
  await apiContextUnauthorized.delete(URLS.USERS + hooks.context.get("userId"));
})
