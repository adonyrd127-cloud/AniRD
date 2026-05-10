const rewire = require('rewire');
const { ApiError } = require('../src/utils/api-error');

const animeService = rewire('../src/services/animeav1.service.js');

const resolveAbsoluteUrl = animeService.__get__('resolveAbsoluteUrl');
const extractSvelteData = animeService.__get__('extractSvelteData');
const normalizeInputUrl = animeService.__get__('normalizeInputUrl');

jest.mock('axios');
const axiosMock = require('axios');
animeService.__set__('axios', axiosMock);

describe('animeav1.service.js pure functions', () => {
  describe('resolveAbsoluteUrl', () => {
    it('should resolve absolute url correctly', () => {
      expect(resolveAbsoluteUrl('/foo/bar', 'example.com')).toBe('https://example.com/foo/bar');
      expect(resolveAbsoluteUrl('https://other.com/foo')).toBe('https://other.com/foo');
      expect(resolveAbsoluteUrl(null)).toBeNull();
      expect(resolveAbsoluteUrl(123)).toBeNull();
    });
  });

  describe('normalizeInputUrl', () => {
    it('should return normalized url', () => {
      expect(normalizeInputUrl('/media/foo', 'test.com')).toBe('https://test.com/media/foo');
    });

    it('should throw ApiError for invalid url', () => {
      let threw = false;
      try {
        normalizeInputUrl(null);
      } catch (err) {
        threw = true;
        expect(err.statusCode).toBe(400);
      }
      expect(threw).toBe(true);
    });
  });

  describe('extractSvelteData', () => {
    it('should extract data from __sveltekit_ variable', () => {
      const html = `
        <html>
          <body>
            <script>
              const __sveltekit_abc123 = {
                data: [
                  { title: "Test Anime", episodes: [{ number: 1 }] }
                ]
              };
            </script>
          </body>
        </html>
      `;
      const data = extractSvelteData(html);
      expect(data).toEqual([{ title: "Test Anime", episodes: [{ number: 1 }] }]);
    });

    it('should extract data from data: array format', () => {
      const html = `
        <html>
          <body>
            <script>
              const state = {
                data: [
                  { title: "Test Anime Data Array" }
                ]
              };
              const __sveltekit_ = {}; // to pass the includes check
            </script>
          </body>
        </html>
      `;
      const data = extractSvelteData(html);
      expect(data).toEqual([{ title: "Test Anime Data Array" }]);
    });

    it('should return null if no valid data is found', () => {
      const html = `<html><body><script>const x = 1;</script></body></html>`;
      expect(extractSvelteData(html)).toBeNull();
    });
  });
});

describe('animeav1.service.js exported functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchAnime', () => {
    it('should throw ApiError if query is empty', async () => {
      let threw = false;
      try {
        await animeService.searchAnime('');
      } catch (err) {
        threw = true;
        expect(err.statusCode).toBe(400);
      }
      expect(threw).toBe(true);
    });

    it('should return search results from HTML correctly when no svelte data', async () => {
      const mockHtml = `
        <html>
          <body>
            <article>
              <a href="/media/test-anime" title="Test Anime Link">
                <img src="/images/poster.jpg" alt="Test Anime Alt" />
                <h3>Test Anime</h3>
              </a>
            </article>
          </body>
        </html>
      `;
      axiosMock.get.mockResolvedValue({ data: mockHtml, status: 200 });

      const result = await animeService.searchAnime('test', 'example.com');

      expect(axiosMock.get).toHaveBeenCalledWith('https://example.com/catalogo?search=test', expect.any(Object));

      expect(result.success).toBe(true);
      expect(result.source).toBe('html');
      expect(result.data.query).toBe('test');
      expect(result.data.results).toHaveLength(1);
      expect(result.data.results[0]).toEqual(expect.objectContaining({
        title: 'Test Anime',
        slug: 'test-anime',
        url: 'https://example.com/media/test-anime',
        image: 'https://example.com/images/poster.jpg'
      }));
    });

    it('should return search results from svelteData JSON', async () => {
      const mockHtml = `
        <html>
          <script>
            const __sveltekit_foo = {
              data: [
                [
                  { title: "Test Anime 1", slug: "test-anime-1", url: "/media/test-anime-1", poster: "/poster1.jpg" },
                  { title: "Test Anime 2", slug: "test-anime-2", url: "/media/test-anime-2", poster: "/poster2.jpg" }
                ]
              ]
            };
          </script>
        </html>
      `;
      axiosMock.get.mockResolvedValue({ data: mockHtml, status: 200 });

      const result = await animeService.searchAnime('test', 'example.com');

      expect(result.success).toBe(true);
      expect(result.source).toBe('json');
      expect(result.data.results.length).toBeGreaterThan(0);
      expect(result.data.results[0].title).toBe('Test Anime 1');
      expect(result.data.results[0].slug).toBe('test-anime-1');
    });
  });

  describe('getAnimeInfo', () => {
    it('should throw ApiError if svelte data is missing', async () => {
      axiosMock.get.mockResolvedValueOnce({ data: '<html><body></body></html>', status: 200 });
      let threw = false;
      try {
        await animeService.getAnimeInfo('https://example.com/media/test');
      } catch (err) {
        threw = true;
        expect(err.statusCode).toBe(500);
      }
      expect(threw).toBe(true);
    });

    it('should return anime info from svelte data', async () => {
      const mockHtml = `
        <html>
          <script>
            const __sveltekit_info = {
              data: [
                {
                  media: {
                    id: 1,
                    title: "Test Anime",
                    slug: "test-anime",
                    description: "Test description",
                    episodes: [
                      { number: 1, url: "/media/test-anime/1" }
                    ]
                  }
                }
              ]
            };
          </script>
        </html>
      `;
      axiosMock.get.mockResolvedValueOnce({ data: mockHtml, status: 200 });

      const result = await animeService.getAnimeInfo('https://example.com/media/test');

      expect(result.success).toBe(true);
      expect(result.source).toBe('json');
      expect(result.data.title).toBe('Test Anime');
      expect(result.data.description).toBe('Test description');
      expect(result.data.episodes).toHaveLength(1);
      expect(result.data.episodes[0].number).toBe(1);
    });
  });

  describe('getEpisodeLinks', () => {
    it('should return episode links correctly', async () => {
      const mockHtml = `
        <html>
          <script>
            const __sveltekit_ep = {
              data: [
                {
                  episode: {
                    id: 10,
                    number: 5,
                    title: "Ep 5"
                  },
                  streamLinks: {
                    SUB: [
                      { server: "Fembed", url: "https://fembed.com/file/123" }
                    ]
                  }
                }
              ]
            };
          </script>
        </html>
      `;
      axiosMock.get.mockResolvedValueOnce({ data: mockHtml, status: 200 });

      const result = await animeService.getEpisodeLinks('https://example.com/media/test/5');

      expect(result.success).toBe(true);
      expect(result.source).toBe('json');
      expect(result.data.id).toBe(10);
      expect(result.data.episode).toBe(5);
      expect(result.data.variants.SUB).toBe(1);
      expect(result.data.streamLinks.SUB).toHaveLength(1);
      expect(result.data.streamLinks.SUB[0].server).toBe('Fembed');
      expect(result.data.streamLinks.SUB[0].url).toBe('https://fembed.com/file/123');
    });

    it('should include mega if requested', async () => {
      const mockHtml = `
        <html>
          <script>
            const __sveltekit_ep = {
              data: [
                {
                  episode: { id: 10 },
                  streamLinks: {
                    SUB: [
                      { server: "Mega", url: "https://mega.nz/file/123" }
                    ]
                  }
                }
              ]
            };
          </script>
        </html>
      `;
      axiosMock.get.mockResolvedValueOnce({ data: mockHtml, status: 200 });

      const result = await animeService.getEpisodeLinks('https://example.com/media/test/5', true);
      expect(result.data.variants.SUB).toBe(1);
      expect(result.data.streamLinks.SUB).toHaveLength(1);
      expect(result.data.streamLinks.SUB[0].server).toBe('Mega');
    });
  });
});
