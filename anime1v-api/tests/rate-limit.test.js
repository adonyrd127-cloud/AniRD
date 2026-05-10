const fs = require("node:fs");
const path = require("node:path");

// Mock fs to avoid creating actual files and directories
jest.mock("node:fs", () => {
  return {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
  };
});

// Since jest doesn't easily compare custom Error classes from different scopes when using expect.any
// we will verify properties on the error object directly.
describe("Rate Limit Middleware", () => {
  let dailyRateLimit;
  let req;
  let res;
  let next;
  const originalEnv = process.env;

  beforeAll(() => {
    jest.useFakeTimers(); // Intercept setInterval so process can exit
    // mock process.on to prevent attaching too many listeners and exiting tests
    jest.spyOn(process, 'on').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Reset fs mocks behavior
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue('{}');

    // Reset env
    process.env = { ...originalEnv };

    // Reset mocks
    jest.clearAllMocks();

    req = {
      headers: {},
      socket: { remoteAddress: "127.0.0.1" },
      apiKey: "test-api-key"
    };

    res = {
      setHeader: jest.fn()
    };

    next = jest.fn();

    jest.isolateModules(() => {
      dailyRateLimit = require("../src/middlewares/rate-limit").dailyRateLimit;
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("File System persistence", () => {
    it("should load usage from file if exists", () => {
      fs.existsSync.mockImplementation((file) => {
        return true; // Both DIR and FILE exist
      });
      // The actual code stores `{ "apiKey:dayStamp": count }`
      fs.readFileSync.mockReturnValue(JSON.stringify({ "test-api-key:2024-01-01": 5 }));

      let localDailyRateLimit;
      jest.isolateModules(() => {
        localDailyRateLimit = require("../src/middlewares/rate-limit").dailyRateLimit;
      });

      // Provide a fixed date for test
      const mockDate = new Date("2024-01-01T12:00:00Z");
      jest.setSystemTime(mockDate);

      process.env.DAILY_REQUEST_LIMIT = "10";
      process.env.DISABLE_RATE_LIMIT = "false";

      localDailyRateLimit(req, res, next);

      // Should have 5 requests already, this will be 6th
      expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "4");
    });

    it("should save usage via setInterval", () => {
      const mockDate = new Date("2024-01-01T12:00:00Z");
      jest.setSystemTime(mockDate);

      process.env.DAILY_REQUEST_LIMIT = "10";
      process.env.DISABLE_RATE_LIMIT = "false";

      let localDailyRateLimit;
      jest.isolateModules(() => {
        localDailyRateLimit = require("../src/middlewares/rate-limit").dailyRateLimit;
      });

      localDailyRateLimit(req, res, next); // Makes 1 request

      // Advance timers to trigger setInterval
      jest.advanceTimersByTime(30000);

      expect(fs.writeFileSync).toHaveBeenCalled();
      const calls = fs.writeFileSync.mock.calls;
      const writtenData = JSON.parse(calls[calls.length - 1][1]);

      // Look up what keys we actually saved
      const keys = Object.keys(writtenData);
      expect(keys.length).toBe(1);
      expect(keys[0].startsWith("test-api-key")).toBe(true);
      expect(writtenData[keys[0]]).toBe(1);
    });

    it("should handle invalid JSON smoothly when loading", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('invalid-json');

      let localDailyRateLimit;
      jest.isolateModules(() => {
        localDailyRateLimit = require("../src/middlewares/rate-limit").dailyRateLimit;
      });

      process.env.DAILY_REQUEST_LIMIT = "10";
      process.env.DISABLE_RATE_LIMIT = "false";

      localDailyRateLimit(req, res, next);

      // Starts fresh
      expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "9");
    });
  });

  describe("cleanupOldEntries", () => {
    it("should clean up old entries if map size >= 2000", () => {
      let localDailyRateLimit;

      // We set the date first so the module initialization and usage happen on that date
      const oldDateMock = new Date("2024-01-01T12:00:00Z");
      jest.setSystemTime(oldDateMock);

      jest.isolateModules(() => {
        localDailyRateLimit = require("../src/middlewares/rate-limit").dailyRateLimit;
      });

      process.env.DAILY_REQUEST_LIMIT = "10000";
      process.env.DISABLE_RATE_LIMIT = "false";

      // Generate 2000 entries
      for(let i=0; i<2000; i++) {
        req.apiKey = `user-${i}`;
        localDailyRateLimit(req, res, next);
        res.setHeader.mockClear();
      }

      // Now date changes
      const newDateMock = new Date("2024-01-02T12:00:00Z");
      jest.setSystemTime(newDateMock);
      req.apiKey = "new-user";

      // The 2001st request will trigger cleanup
      localDailyRateLimit(req, res, next);

      // Trigger save to inspect what's left
      fs.writeFileSync.mockClear();
      jest.advanceTimersByTime(30000);

      // Only the new-user entry should be saved because 2024-01-01 is old
      expect(fs.writeFileSync).toHaveBeenCalled();
      const calls = fs.writeFileSync.mock.calls;
      const lastCallData = JSON.parse(calls[calls.length - 1][1]);

      // we check the length of keys
      expect(Object.keys(lastCallData).length).toBe(1);
      expect(Object.keys(lastCallData)[0]).toBe("new-user:2024-01-02");
    });
  });

  it("should bypass rate limit if DISABLE_RATE_LIMIT is true", () => {
    process.env.DISABLE_RATE_LIMIT = "true";

    dailyRateLimit(req, res, next);

    expect(next).toHaveBeenCalledWith(); // called without error
    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it("should allow request and set headers if under the limit", () => {
    process.env.DAILY_REQUEST_LIMIT = "5";
    process.env.DISABLE_RATE_LIMIT = "false";

    dailyRateLimit(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Limit", "5");
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Reset", expect.any(String));
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "4");
    expect(next).toHaveBeenCalledWith(); // called without error
  });

  it("should track multiple requests and reject when limit is exceeded", () => {
    process.env.DAILY_REQUEST_LIMIT = "2";
    process.env.DISABLE_RATE_LIMIT = "false";

    // Request 1
    dailyRateLimit(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "1");
    expect(next).toHaveBeenCalledWith();

    next.mockClear();
    res.setHeader.mockClear();

    // Request 2
    dailyRateLimit(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "0");
    expect(next).toHaveBeenCalledWith();

    next.mockClear();
    res.setHeader.mockClear();

    // Request 3 - should fail
    dailyRateLimit(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "0");

    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeDefined();
    expect(errorArg.statusCode).toBe(429);
    expect(errorArg.message).toContain("Limite de requests alcanzado");
  });

  it("should use 'anonymous' if apiKey is not provided", () => {
    process.env.DAILY_REQUEST_LIMIT = "1";
    process.env.DISABLE_RATE_LIMIT = "false";

    req.apiKey = undefined;

    dailyRateLimit(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "0");
    expect(next).toHaveBeenCalledWith();

    // Check second request with undefined API key
    next.mockClear();
    dailyRateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeDefined();
    expect(errorArg.statusCode).toBe(429);
  });

  it("should default daily limit to 100 if not provided in env", () => {
    delete process.env.DAILY_REQUEST_LIMIT;
    process.env.DISABLE_RATE_LIMIT = "false";

    dailyRateLimit(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Limit", "100");
    expect(res.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", "99");
    expect(next).toHaveBeenCalledWith();
  });
});
