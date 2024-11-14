import { When } from "@cucumber/cucumber";
import { hooks } from "../../setup/hooks";
import { APIContext, URLS } from "../../../../support/apiContext";

let apiContext = new APIContext(true);
let apiContextUnauthorized = new APIContext(false);

When("I request to update the user with the following details", async (table: any) => {
  console.log("I request to update the user with the following details: " + JSON.stringify(table.hashes()[0]));
  const userDetails = table.hashes()[0];
  const requestBody = {
    name: userDetails.name,
    gender: userDetails.gender,
    email: userDetails.email,
    status: userDetails.status,
  };
  await apiContext.put(URLS.USERS + hooks.context.get("userId"), requestBody);
});

When("I request to partial update the user with the following details", async (table: any) => {
  console.log("I request to partial update the user with the following details: " + JSON.stringify(table.hashes()[0]));
  const userDetails = table.hashes()[0];
  await apiContext.patch(URLS.USERS + hooks.context.get("userId"), userDetails);
});

When('I request to update a user with id {int} with no authentication', async (int: number, table: any) => {
  console.log("I request to update a user with id " + int + " with no authentication")
  const userDetails = table.hashes()[0];
  const requestBody = {
    name: userDetails.name,
    gender: userDetails.gender,
    email: userDetails.email,
    status: userDetails.status,
  };
  await apiContextUnauthorized.put(URLS.USERS + int, requestBody);
})
