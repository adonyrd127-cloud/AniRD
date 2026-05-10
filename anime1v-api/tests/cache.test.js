describe('Cache Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let cacheMiddleware;

  const createMocks = (url = '/api/test', method = 'GET') => {
    const req = {
      method,
      originalUrl: url,
    };
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    return { req, res, next };
  };

  beforeEach(() => {
    const mocks = createMocks();
    mockReq = mocks.req;
    mockRes = mocks.res;
    mockNext = mocks.next;

    // Reset modules to ensure the cacheStore Map is cleared between tests
    jest.resetModules();
    cacheMiddleware = require('../src/middlewares/cache');

    // Some implementations export it as an object, some directly depending on the code version
    if (cacheMiddleware.cacheMiddleware) {
      cacheMiddleware = cacheMiddleware.cacheMiddleware;
    }

    // Reset timers just in case
    jest.useRealTimers();
  });

  test('should skip caching for non-GET requests', () => {
    mockReq.method = 'POST';
    const middleware = cacheMiddleware();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.setHeader).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  test('should cache successful response on first request and return MISS', () => {
    const middleware = cacheMiddleware();
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();

    const responseData = { data: 'test data' };

    // Simulate the controller calling res.json
    mockRes.json(responseData);

    expect(mockRes.setHeader).toHaveBeenCalledWith('X-Cache', 'MISS');
  });

  test('should return HIT on subsequent requests within TTL', () => {
    const middleware = cacheMiddleware();

    // First request
    middleware(mockReq, mockRes, mockNext);
    const responseData = { data: 'test data' };
    mockRes.json(responseData); // Caches the response

    // Second request (fresh mocks)
    const { req: req2, res: res2, next: next2 } = createMocks();
    middleware(req2, res2, next2);

    expect(next2).not.toHaveBeenCalled();
    expect(res2.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
    expect(res2.status).toHaveBeenCalledWith(200);
    expect(res2.json).toHaveBeenCalledWith(responseData);
  });

  test('should not cache if status code is >= 300', () => {
    const middleware = cacheMiddleware();
    middleware(mockReq, mockRes, mockNext);

    mockRes.statusCode = 404;
    mockRes.json({ error: 'Not Found' });

    // Second request (fresh mocks)
    const { req: req2, res: res2, next: next2 } = createMocks();
    middleware(req2, res2, next2);

    // It should not be cached, so next() should be called
    expect(next2).toHaveBeenCalled();
    expect(res2.setHeader).not.toHaveBeenCalledWith('X-Cache', 'HIT');
  });

  test('should expire cache after TTL', () => {
    jest.useFakeTimers();

    const ttlMs = 1000;
    const middleware = cacheMiddleware(ttlMs);

    // First request
    middleware(mockReq, mockRes, mockNext);
    mockRes.json({ data: 'test data' });

    // Advance time past TTL
    jest.advanceTimersByTime(1500);

    // Second request (fresh mocks)
    const { req: req2, res: res2, next: next2 } = createMocks();
    middleware(req2, res2, next2);

    // Cache should be expired, so next() should be called
    expect(next2).toHaveBeenCalled();
    expect(res2.setHeader).not.toHaveBeenCalledWith('X-Cache', 'HIT');

    jest.useRealTimers();
  });

  test('should generate correct key using req.url if req.originalUrl is missing', () => {
    mockReq.originalUrl = undefined;
    mockReq.url = '/api/fallback-url';

    const middleware = cacheMiddleware();

    // First request
    middleware(mockReq, mockRes, mockNext);
    mockRes.json({ data: 'fallback' });

    // Second request (fresh mocks)
    const { req: req2, res: res2, next: next2 } = createMocks('/api/fallback-url');
    req2.originalUrl = undefined;
    req2.url = '/api/fallback-url';

    middleware(req2, res2, next2);

    expect(next2).not.toHaveBeenCalled();
    expect(res2.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
  });
});
