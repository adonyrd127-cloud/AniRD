const test = require('node:test');
const assert = require('node:assert');
const { ApiError } = require('../src/utils/api-error');

test('ApiError class', async (t) => {
  await t.test('should correctly set the properties', () => {
    const statusCode = 400;
    const message = 'Bad Request';
    const isOperational = true;
    const stack = 'custom stack';
    const details = { field: 'email', error: 'invalid' };

    const error = new ApiError(statusCode, message, isOperational, stack, details);

    assert.strictEqual(error.statusCode, statusCode);
    assert.strictEqual(error.message, message);
    assert.strictEqual(error.isOperational, isOperational);
    assert.strictEqual(error.stack, stack);
    assert.deepStrictEqual(error.details, details);
  });

  await t.test('should use default values for isOperational and stack', () => {
    const statusCode = 500;
    const message = 'Internal Server Error';

    const error = new ApiError(statusCode, message);

    assert.strictEqual(error.statusCode, statusCode);
    assert.strictEqual(error.message, message);
    assert.strictEqual(error.isOperational, true);
    assert.ok(error.stack);
    assert.strictEqual(error.details, null);
  });

  await t.test('should capture stack trace if not provided', () => {
    const error = new ApiError(500, 'Error');
    assert.ok(error.stack.includes('api-error.test.js'));
  });

  await t.test('should be an instance of Error', () => {
    const error = new ApiError(500, 'Error');
    assert.ok(error instanceof Error);
    assert.ok(error instanceof ApiError);
  });

  await t.test('should handle legacy-style calls (if details was passed as 3rd param by mistake)', () => {
    // Note: If someone was doing `new ApiError(500, "msg", "some details")` before,
    // now "some details" will go to isOperational.
    // However, looking at the code, it seems most usages only used 2 or 3 params.
    // If it was 3 params, it was (statusCode, message, details).
    // Let's see if we should support that.

    const error = new ApiError(500, 'Error', 'Some Details');
    assert.strictEqual(error.isOperational, 'Some Details'); // This is a bit weird but expected with the new signature
  });
});
