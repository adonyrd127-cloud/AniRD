const request = require("supertest");
const express = require("express");

// Mock middlewares first
jest.mock("../src/middlewares/auth", () => ({
  requireApiKey: (req, res, next) => next(),
}));

jest.mock("../src/middlewares/rate-limit", () => ({
  dailyRateLimit: (req, res, next) => next(),
}));

jest.mock("../src/middlewares/cache", () => ({
  cacheMiddleware: () => (req, res, next) => next(),
}));

// Mock services next
const animeService = require("../src/services/anime.service");
jest.mock("../src/services/anime.service", () => ({
  searchAnime: jest.fn(),
  getAnimeInfo: jest.fn(),
  getEpisodeLinks: jest.fn(),
}));

const downloadService = require("../src/services/download.service");
jest.mock("../src/services/download.service", () => ({
  createDownload: jest.fn(),
  getDownload: jest.fn(),
  createBatch: jest.fn(),
  getBatch: jest.fn(),
}));

// Require routes after mocks have been established
const animeRoutes = require("../src/routes/anime.routes");

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use("/api/anime", animeRoutes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe("Anime Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/anime/search", () => {
    it("should return 400 if 'q' parameter is missing", async () => {
      const response = await request(app).get("/api/anime/search");
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("El parametro 'q' (query) es requerido");
      expect(animeService.searchAnime).not.toHaveBeenCalled();
    });

    it("should return search results successfully", async () => {
      const mockResult = { results: [{ title: "Naruto" }] };
      animeService.searchAnime.mockResolvedValue(mockResult);

      const response = await request(app).get("/api/anime/search?q=naruto&domain=test");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(animeService.searchAnime).toHaveBeenCalledWith("naruto", "test");
    });
  });

  describe("GET /api/anime/info", () => {
    it("should return 400 if 'url' parameter is missing", async () => {
      const response = await request(app).get("/api/anime/info");
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Se requiere el parametro url");
      expect(animeService.getAnimeInfo).not.toHaveBeenCalled();
    });

    it("should return anime info successfully", async () => {
      const mockResult = { title: "Naruto", synopsis: "Ninja" };
      animeService.getAnimeInfo.mockResolvedValue(mockResult);

      const response = await request(app).get("/api/anime/info?url=test-url");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(animeService.getAnimeInfo).toHaveBeenCalledWith("test-url");
    });
  });

  describe("GET /api/anime/episode", () => {
    it("should return 400 if 'url' parameter is missing", async () => {
      const response = await request(app).get("/api/anime/episode");
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Se requiere el parametro url");
      expect(animeService.getEpisodeLinks).not.toHaveBeenCalled();
    });

    it("should return episode links successfully", async () => {
      const mockResult = { links: ["link1", "link2"] };
      animeService.getEpisodeLinks.mockResolvedValue(mockResult);

      const response = await request(app).get("/api/anime/episode?url=test-episode-url&includeMega=true&excludeServers=okru");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(animeService.getEpisodeLinks).toHaveBeenCalledWith("test-episode-url", "true", "okru");
    });
  });

  describe("POST /api/anime/download", () => {
    it("should create a download task successfully", async () => {
      const mockBody = { episodeUrl: "test-url" };
      const mockData = { id: "123", status: "pending" };
      downloadService.createDownload.mockReturnValue(mockData);

      const response = await request(app)
        .post("/api/anime/download")
        .send(mockBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockData });
      expect(downloadService.createDownload).toHaveBeenCalledWith(mockBody, expect.any(String));
    });
  });

  describe("GET /api/anime/download/:id", () => {
    it("should return download task status successfully", async () => {
      const mockData = { id: "123", status: "completed" };
      downloadService.getDownload.mockReturnValue(mockData);

      const response = await request(app).get("/api/anime/download/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockData });
      expect(downloadService.getDownload).toHaveBeenCalledWith("123");
    });
  });

  describe("POST /api/anime/batch-download", () => {
    it("should create a batch download task successfully", async () => {
      const mockBody = { episodeUrls: ["url1", "url2"] };
      const mockData = { id: "batch123", status: "pending" };
      downloadService.createBatch.mockReturnValue(mockData);

      const response = await request(app)
        .post("/api/anime/batch-download")
        .send(mockBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockData });
      expect(downloadService.createBatch).toHaveBeenCalledWith(mockBody, expect.any(String));
    });
  });

  describe("GET /api/anime/batch/:id", () => {
    it("should return batch download task status successfully", async () => {
      const mockData = { id: "batch123", status: "completed" };
      downloadService.getBatch.mockReturnValue(mockData);

      const response = await request(app).get("/api/anime/batch/batch123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: mockData });
      expect(downloadService.getBatch).toHaveBeenCalledWith("batch123");
    });
  });
});
