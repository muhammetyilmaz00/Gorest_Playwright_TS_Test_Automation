import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { ContextStore } from "../../../support/contextStore";
import { APIContext, URLS } from "../../../support/apiContext";

let apiContext = new APIContext(true);
const contextStore = new ContextStore()
export const hooks = {
    context: contextStore
}

// Set the default timeout for Cucumber steps.
setDefaultTimeout(60000);

Before(async (scenario: any) => {
    console.log(`Scenario started: ${scenario.pickle.name}`);
});

After(async (scenario: any) => {
    console.log(`Scenario finished: ${scenario.pickle.name}`);
});

After({ tags: '@createUser' }, async () => {
    // Delete the created user after all tests are done.
    console.log(`Deleting the created user at the after-step`);
    await apiContext.delete(URLS.USERS + contextStore.get("userId"));
});

