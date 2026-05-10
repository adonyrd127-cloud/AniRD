const test = require("node:test");
const assert = require("node:assert");
const { requireApiKey } = require("../src/middlewares/auth");

test("auth middleware", async (t) => {
  await t.test("fail-open auth bypass vulnerability", () => {
    // Setup
    process.env.API_KEYS = ""; // No configured keys
    process.env.DISABLE_AUTH = "false";

    const req = {
      header: (key) => {
        if (key === "x-api-key") return "hacker-key";
        return null;
      }
    };

    let nextCalled = false;
    let nextError = null;
    const next = (err) => {
      nextCalled = true;
      nextError = err;
    };

    // Execute
    requireApiKey(req, null, next);

    // After fix behaviour: nextError should be an error
    assert.ok(nextError !== undefined && nextError !== null, "Expected an error to be thrown since no keys are configured");
    assert.strictEqual(nextError.statusCode, 500, "Expected a 500 status code");
  });
});

test("auth middleware checks", async (t) => {
  await t.test("accepts valid api key", () => {
    process.env.API_KEYS = "valid-key,other-key";
    process.env.DISABLE_AUTH = "false";

    const req = {
      header: (key) => {
        if (key === "x-api-key") return "valid-key";
        return null;
      }
    };

    let nextCalled = false;
    let nextError = null;
    const next = (err) => {
      nextCalled = true;
      nextError = err;
    };

    requireApiKey(req, null, next);

    assert.strictEqual(nextError, undefined);
    assert.strictEqual(req.apiKey, "valid-key");
  });

  await t.test("rejects invalid api key", () => {
    process.env.API_KEYS = "valid-key,other-key";
    process.env.DISABLE_AUTH = "false";

    const req = {
      header: (key) => {
        if (key === "x-api-key") return "invalid-key";
        return null;
      }
    };

    let nextCalled = false;
    let nextError = null;
    const next = (err) => {
      nextCalled = true;
      nextError = err;
    };

    requireApiKey(req, null, next);

    assert.ok(nextError !== undefined && nextError !== null);
    assert.strictEqual(nextError.statusCode, 401);
  });
});
