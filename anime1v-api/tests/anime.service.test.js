const test = require('node:test');
const assert = require('node:assert');

// Ensure all services have the required methods before requiring anime.service.js
const animeav1Service = require('../src/services/animeav1.service');
const jkanimeService = require('../src/services/jkanime.service');
const animeflvService = require('../src/services/animeflv.service');
const hentailaService = require('../src/services/hentaila.service');
const tioanimeService = require('../src/services/tioanime.service');
const monoschinosService = require('../src/services/monoschinos.service');

const services = [animeav1Service, jkanimeService, animeflvService, hentailaService, tioanimeService, monoschinosService];

for (const svc of services) {
  if (typeof svc.searchAnime !== 'function') svc.searchAnime = async () => ({});
  if (typeof svc.getAnimeInfo !== 'function') svc.getAnimeInfo = async () => ({});
  if (typeof svc.getEpisodeLinks !== 'function') svc.getEpisodeLinks = async () => ({});
}

const animeService = require('../src/services/anime.service');

test('searchAnime tests', async (t) => {
  await t.test('uses forced provider if domain matches', async (t) => {
    const animeav1SearchMock = t.mock.method(animeav1Service, 'searchAnime', async () => {
      return { data: { count: 1, results: ['animeav1-result'] }, source: 'animeav1' };
    });

    const res = await animeService.searchAnime('naruto1', 'animeav1.com');

    assert.strictEqual(res.source, 'animeav1');
    assert.strictEqual(res.data.results[0], 'animeav1-result');
    assert.strictEqual(animeav1SearchMock.mock.callCount(), 1);
  });

  await t.test('falls back to other providers if first is empty', async (t) => {
    const animeav1Mock = t.mock.method(animeav1Service, 'searchAnime', async () => {
      return { data: { count: 0, results: [] } };
    });

    const jkanimeMock = t.mock.method(jkanimeService, 'searchAnime', async () => {
      return { data: { count: 2, results: ['jk-res1', 'jk-res2'] } };
    });

    const res = await animeService.searchAnime('naruto2', null);

    assert.strictEqual(res.source, 'jkanime');
    assert.strictEqual(res.data.count, 2);
    assert.strictEqual(animeav1Mock.mock.callCount(), 1);
    assert.strictEqual(jkanimeMock.mock.callCount(), 1);
  });

  await t.test('returns last empty if all providers are empty and no errors', async (t) => {
    const mocks = [
      t.mock.method(animeav1Service, 'searchAnime', async () => ({ data: { count: 0 } })),
      t.mock.method(jkanimeService, 'searchAnime', async () => ({ data: { count: 0 } })),
      t.mock.method(animeflvService, 'searchAnime', async () => ({ data: { count: 0 } })),
      t.mock.method(hentailaService, 'searchAnime', async () => ({ data: { count: 0 } })),
      t.mock.method(tioanimeService, 'searchAnime', async () => ({ data: { count: 0 } })),
      t.mock.method(monoschinosService, 'searchAnime', async () => ({ data: { count: 0 } })),
    ];

    const res = await animeService.searchAnime('empty-search', null);

    assert.strictEqual(res.source, 'animeav1');
    assert.strictEqual(res.data.count, 0);

    for (const mock of mocks) {
      assert.strictEqual(mock.mock.callCount(), 1);
    }
  });

  await t.test('throws ApiError if all providers fail', async (t) => {
    const errorMsg = 'Service down';
    const mocks = [
      t.mock.method(animeav1Service, 'searchAnime', async () => { throw new Error(errorMsg); }),
      t.mock.method(jkanimeService, 'searchAnime', async () => { throw new Error(errorMsg); }),
      t.mock.method(animeflvService, 'searchAnime', async () => { throw new Error(errorMsg); }),
      t.mock.method(hentailaService, 'searchAnime', async () => { throw new Error(errorMsg); }),
      t.mock.method(tioanimeService, 'searchAnime', async () => { throw new Error(errorMsg); }),
      t.mock.method(monoschinosService, 'searchAnime', async () => { throw new Error(errorMsg); }),
    ];

    await assert.rejects(
      async () => await animeService.searchAnime('fail-search', null),
      (err) => {
        assert.strictEqual(err.statusCode, 502);
        assert.match(err.message, /No se pudo completar la busqueda. Errores:/);
        return true;
      }
    );
  });
});

test('getAnimeInfo tests', async (t) => {
  await t.test('finds correct provider based on URL and returns data', async (t) => {
    const jkanimeMock = t.mock.method(jkanimeService, 'getAnimeInfo', async () => {
      return { data: { title: 'JK Anime Info' } };
    });

    const res = await animeService.getAnimeInfo('https://jkanime.net/naruto');

    assert.strictEqual(res.source, 'jkanime');
    assert.strictEqual(res.data.title, 'JK Anime Info');
    assert.strictEqual(jkanimeMock.mock.callCount(), 1);
  });

  await t.test('defaults to first provider if URL does not match any', async (t) => {
    const animeav1Mock = t.mock.method(animeav1Service, 'getAnimeInfo', async () => {
      return { data: { title: 'Default Info' } };
    });

    const res = await animeService.getAnimeInfo('https://unknown-domain.com/naruto');

    assert.strictEqual(res.source, 'animeav1');
    assert.strictEqual(res.data.title, 'Default Info');
    assert.strictEqual(animeav1Mock.mock.callCount(), 1);
  });
});

test('getEpisodeLinks tests', async (t) => {
  await t.test('finds correct provider and gets links', async (t) => {
    const tioanimeMock = t.mock.method(tioanimeService, 'getEpisodeLinks', async () => {
      return { data: { links: ['link1'] } };
    });

    const res = await animeService.getEpisodeLinks('https://tioanime.com/ver/naruto-1', true, false);

    assert.strictEqual(res.source, 'tioanime');
    assert.strictEqual(res.data.links[0], 'link1');
    assert.strictEqual(tioanimeMock.mock.callCount(), 1);
  });
});

test('caching tests', async (t) => {
  await t.test('searchAnime caches the result', async (t) => {
    const animeav1Mock = t.mock.method(animeav1Service, 'searchAnime', async () => {
      return { data: { count: 1, name: 'cached-anime' } };
    });

    const q = 'cache-test-search';

    const res1 = await animeService.searchAnime(q, 'animeav1.com');
    const res2 = await animeService.searchAnime(q, 'animeav1.com');

    assert.deepStrictEqual(res1, res2);
    assert.strictEqual(animeav1Mock.mock.callCount(), 1);
  });

  await t.test('getAnimeInfo caches the result', async (t) => {
    const jkanimeMock = t.mock.method(jkanimeService, 'getAnimeInfo', async () => {
      return { data: { title: 'cached-info' } };
    });

    const url = 'https://jkanime.net/cache-test';

    const res1 = await animeService.getAnimeInfo(url);
    const res2 = await animeService.getAnimeInfo(url);

    assert.deepStrictEqual(res1, res2);
    assert.strictEqual(jkanimeMock.mock.callCount(), 1);
  });
});

test('normalizeDomain invalid cases', async (t) => {
  await t.test('domain without string returns null and falls back to all providers', async (t) => {
    const animeav1Mock = t.mock.method(animeav1Service, 'searchAnime', async () => ({ data: { count: 1 } }));
    const jkanimeMock = t.mock.method(jkanimeService, 'searchAnime', async () => ({ data: { count: 1 } }));
    const animeflvMock = t.mock.method(animeflvService, 'searchAnime', async () => ({ data: { count: 1 } }));
    const hentailaMock = t.mock.method(hentailaService, 'searchAnime', async () => ({ data: { count: 1 } }));
    const tioanimeMock = t.mock.method(tioanimeService, 'searchAnime', async () => ({ data: { count: 1 } }));
    const monoschinosMock = t.mock.method(monoschinosService, 'searchAnime', async () => ({ data: { count: 1 } }));

    const res = await animeService.searchAnime('test', 123);

    assert.strictEqual(res.source, 'animeav1');
    assert.strictEqual(animeav1Mock.mock.callCount(), 1);
  });
});

test('domain Matches test cases', async (t) => {
  await t.test('urlCandidate throws on URL constructor in findProviderForUrl', async (t) => {
    const animeav1Mock = t.mock.method(animeav1Service, 'getAnimeInfo', async () => ({ data: { title: 'Default Info' } }));
    const res = await animeService.getAnimeInfo('invalid-url-not-http');

    assert.strictEqual(res.source, 'animeav1');
    assert.strictEqual(animeav1Mock.mock.callCount(), 1);
  });
});
