const test = require('node:test');
const assert = require('node:assert');
const { detectProvider, DEFAULT_PROVIDER } = require('../descargador');

test('detectProvider', async (t) => {
  await t.test('should identify animeav1 correctly', () => {
    assert.strictEqual(detectProvider('animeav1.com'), 'animeav1');
    assert.strictEqual(detectProvider('https://animeav1.com/something'), 'animeav1');
    assert.strictEqual(detectProvider('ANIMEAV1.COM'), 'animeav1');
    assert.strictEqual(detectProvider('animeav1'), 'animeav1');
  });

  await t.test('should identify animeflv correctly', () => {
    assert.strictEqual(detectProvider('animeflv.net'), 'animeflv');
    assert.strictEqual(detectProvider('animeflv'), 'animeflv');
    assert.strictEqual(detectProvider('www4.animeflv.net'), 'animeflv');
  });

  await t.test('should identify jkanime correctly', () => {
    assert.strictEqual(detectProvider('jkanime.net'), 'jkanime');
    assert.strictEqual(detectProvider('jkanime'), 'jkanime');
    assert.strictEqual(detectProvider('https://jkanime.net/one-piece/'), 'jkanime');
  });

  await t.test('should identify tioanime correctly', () => {
    assert.strictEqual(detectProvider('tioanime.com'), 'tioanime');
    assert.strictEqual(detectProvider('tioanime'), 'tioanime');
  });

  await t.test('should identify hentaila correctly', () => {
    assert.strictEqual(detectProvider('hentaila.com'), 'hentaila');
    assert.strictEqual(detectProvider('hentaila'), 'hentaila');
  });

  await t.test('should identify monoschinos correctly', () => {
    assert.strictEqual(detectProvider('monoschinos2.com'), 'monoschinos');
    assert.strictEqual(detectProvider('monoschinos'), 'monoschinos');
  });

  await t.test('should return DEFAULT_PROVIDER for unrecognized inputs', () => {
    assert.strictEqual(detectProvider('unknown.com'), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider('anime.com'), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider('crunchyroll.com'), DEFAULT_PROVIDER);
  });

  await t.test('should handle edge cases and invalid inputs gracefully by returning DEFAULT_PROVIDER', () => {
    assert.strictEqual(detectProvider(null), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider(undefined), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider(''), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider(12345), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider({}), DEFAULT_PROVIDER);
    assert.strictEqual(detectProvider([]), DEFAULT_PROVIDER);
  });
});
