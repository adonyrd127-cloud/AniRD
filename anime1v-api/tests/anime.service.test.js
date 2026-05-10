const test = require('node:test');
const assert = require('node:assert');
const { normalizeDomain } = require('../src/services/anime.service.js');

test('normalizeDomain function', async (t) => {
  await t.test('should return null for empty or non-string inputs', () => {
    assert.strictEqual(normalizeDomain(null), null);
    assert.strictEqual(normalizeDomain(undefined), null);
    assert.strictEqual(normalizeDomain(123), null);
    assert.strictEqual(normalizeDomain('   '), null);
  });

  await t.test('should normalize valid domains', () => {
    assert.strictEqual(normalizeDomain('animeflv.net'), 'animeflv.net');
    assert.strictEqual(normalizeDomain('  JkAnime.net  '), 'jkanime.net');
    assert.strictEqual(normalizeDomain('www.tioanime.com'), 'www.tioanime.com');
  });

  await t.test('should normalize full URLs', () => {
    assert.strictEqual(normalizeDomain('https://animeflv.net/anime/test'), 'animeflv.net');
    assert.strictEqual(normalizeDomain('http://jkanime.net/'), 'jkanime.net');
    assert.strictEqual(normalizeDomain('  https://www.tioanime.com/ver/test  '), 'www.tioanime.com');
  });

  await t.test('should handle invalid URLs (error path)', () => {
    // When an invalid URL that fails parsing is provided, the function catches the error
    // and returns the first segment split by "/"

    // An invalid URL format will throw when prepended with "https://"
    assert.strictEqual(normalizeDomain('invalid url format'), 'invalid url format');

    // An invalid URL format with a slash
    assert.strictEqual(normalizeDomain('invalid url/with slash'), 'invalid url');

    // A URL with spaces and no protocol throws when 'https://' is added
    assert.strictEqual(normalizeDomain('domain.com /path'), 'domain.com ');
  });
});
