import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { apiService } from './api.js';

describe('JikanClient', () => {
  let jikanClient;

  beforeEach(() => {
    jikanClient = apiService.providers.jikan;
    jikanClient.cache.clear();
    jikanClient.inflight.clear();
    jikanClient.lastRequest = 0;

    // We'll mock global fetch
    global.fetch = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should successfully make a request and cache it', async () => {
    const mockData = { data: 'test anime' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData
    });

    const promise = jikanClient.request('/test', { param1: 'value1' });
    vi.runAllTimers(); // fast-forward any minDelay
    const result = await promise;

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.jikan.moe/v4/test?param1=value1');

    // Check cache
    const cacheKey = 'https://api.jikan.moe/v4/test?param1=value1';
    expect(jikanClient.cache.has(cacheKey)).toBe(true);
    expect(jikanClient.cache.get(cacheKey).data).toEqual(mockData);
  });

  it('should return cached response on subsequent identical requests within TTL', async () => {
    const mockData = { data: 'test anime' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData
    });

    // First request
    const promise1 = jikanClient.request('/test');
    vi.runAllTimers();
    await promise1;
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second request right after
    const promise2 = jikanClient.request('/test');
    vi.runAllTimers();
    const result2 = await promise2;

    expect(result2).toEqual(mockData);
    // Fetch should still be called only once
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should bypass cache if TTL has expired', async () => {
    const mockData1 = { data: 'old anime' };
    const mockData2 = { data: 'new anime' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData1
    });

    const promise1 = jikanClient.request('/test');
    vi.runAllTimers();
    await promise1;
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Advance time beyond TTL (10 minutes + 1 ms)
    vi.advanceTimersByTime(10 * 60 * 1000 + 1);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData2
    });

    const promise2 = jikanClient.request('/test');
    vi.runAllTimers();
    const result2 = await promise2;

    expect(result2).toEqual(mockData2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should deduplicate concurrent identical requests', async () => {
    const mockData = { data: 'concurrent anime' };

    // Create a fetch that takes some time to resolve so we can catch the inflight map in action
    let resolveFetch;
    global.fetch.mockReturnValue(new Promise(resolve => {
        resolveFetch = () => resolve({
          ok: true,
          status: 200,
          json: async () => mockData
        });
    }));

    // Launch two requests concurrently
    const promise1 = jikanClient.request('/test-concurrent');
    const promise2 = jikanClient.request('/test-concurrent');

    expect(jikanClient.inflight.size).toBe(1);

    // Now actually resolve the fetch
    resolveFetch();

    // Advance over minDelay wait and let promises resolve
    vi.runAllTimers();

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toEqual(mockData);
    expect(result2).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should wait for minDelay between consecutive requests', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({})
    });

    const req1 = jikanClient.request('/test1');
    vi.runAllTimers();
    await req1;

    // Time elapsed internally by fake timers...

    // Now trigger a second request immediately (conceptually)
    // It should wait Math.max(0, this.lastRequest + this.minDelay - Date.now())
    const req2 = jikanClient.request('/test2');

    // Since we are mocking timers, we want to test if setTimeout is called.
    // fetch shouldn't be called immediately for req2
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only req1 called fetch so far

    // Advance by minDelay
    vi.advanceTimersByTime(jikanClient.minDelay);
    await req2;

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on 429 status after waiting 2000ms', async () => {
    const mockData = { data: 'success after 429' };

    // First call returns 429, second returns 200
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 429 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => mockData });

    const promise = jikanClient.request('/test-429');

    // We need an async helper to advance timers since we're awaiting fake timeouts
    // First wait for any minDelay
    await vi.runOnlyPendingTimersAsync();

    // Now wait for the 429 delay (2000ms)
    await vi.runOnlyPendingTimersAsync();

    const result = await promise;

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw Error on non-ok status', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    const promise = jikanClient.request('/test-error');
    vi.runAllTimers();

    await expect(promise).rejects.toThrow('Jikan error: 500');
  });
});
