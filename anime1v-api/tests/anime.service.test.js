const { searchAnime } = require("../src/services/anime.service");
const animeav1Service = require("../src/services/animeav1.service");
const jkanimeService = require("../src/services/jkanime.service");

// Mocking dependencies to track calls
jest.mock("../src/services/animeav1.service", () => ({
  searchAnime: jest.fn(),
  getAnimeInfo: jest.fn(),
  getEpisodeLinks: jest.fn()
}));

jest.mock("../src/services/jkanime.service", () => ({
  searchAnime: jest.fn(),
  getAnimeInfo: jest.fn(),
  getEpisodeLinks: jest.fn()
}));

describe("anime.service caching", () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should cache successful responses within TTL", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 1, 1, 10, 0, 0).getTime());

    // Setup mock return
    const mockData = { data: { count: 1, items: [{ title: "Test Anime" }] }, source: "animeav1" };
    animeav1Service.searchAnime.mockResolvedValueOnce(mockData);

    // Call 1
    const res1 = await searchAnime("Naruto", "animeav1.com");
    expect(res1).toEqual(mockData);
    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(1);

    // Call 2 - within TTL (1 minute later)
    jest.advanceTimersByTime(60 * 1000);
    const res2 = await searchAnime("Naruto", "animeav1.com");
    expect(res2).toEqual(mockData);
    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(1); // Still 1, read from cache
  });

  it("should invalidate cache after TTL expires", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 1, 1, 10, 0, 0).getTime());

    const mockData1 = { data: { count: 1, items: [{ title: "Test Anime 1" }] }, source: "animeav1" };
    const mockData2 = { data: { count: 1, items: [{ title: "Test Anime 2" }] }, source: "animeav1" };

    animeav1Service.searchAnime
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    // Call 1
    const res1 = await searchAnime("Bleach", "animeav1.com");
    expect(res1).toEqual(mockData1);
    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(1);

    // Advance time past TTL (16 minutes)
    jest.advanceTimersByTime(16 * 60 * 1000);

    // Call 2
    const res2 = await searchAnime("Bleach", "animeav1.com");
    expect(res2).toEqual(mockData2);
    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(2); // Should have made a new call
  });

  it("should separate caches for different arguments", async () => {
    jest.useFakeTimers();

    const mockData1 = { data: { count: 1, items: [{ title: "Test Anime 1" }] }, source: "animeav1" };
    const mockData2 = { data: { count: 1, items: [{ title: "Test Anime 2" }] }, source: "jkanime" };

    animeav1Service.searchAnime.mockResolvedValueOnce(mockData1);
    jkanimeService.searchAnime.mockResolvedValueOnce(mockData2);

    // Call 1
    await searchAnime("One Piece", "animeav1.com");
    // Call 2 - same query, different domain
    await searchAnime("One Piece", "jkanime.net");
    // Call 3 - different query, same domain
    await searchAnime("Two Piece", "animeav1.com");

    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(2); // One Piece & Two Piece
    expect(jkanimeService.searchAnime).toHaveBeenCalledTimes(1);  // One Piece
  });

  it("should not cache if the underlying function throws an error", async () => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    const mockError = new Error("Network failure");
    animeav1Service.searchAnime.mockRejectedValueOnce(mockError);

    await expect(searchAnime("Fail", "animeav1.com")).rejects.toThrow();

    // The cache shouldn't be set if fn() throws, so calling again should hit the provider again
    animeav1Service.searchAnime.mockResolvedValueOnce({ data: { count: 1 }, source: "animeav1" });

    const res = await searchAnime("Fail", "animeav1.com");
    expect(res.source).toBe("animeav1");
    expect(animeav1Service.searchAnime).toHaveBeenCalledTimes(2);
  });
});
