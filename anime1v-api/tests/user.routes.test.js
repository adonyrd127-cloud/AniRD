const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const userRoutes = require("../src/routes/user.routes");
const dataService = require("../src/services/data.service");

const JWT_SECRET = process.env.JWT_SECRET || "anird-secret-key-127";

jest.mock("../src/services/data.service");

describe("User Routes", () => {
  let app;
  let validToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/user", userRoutes);

    // Default error handler for tests
    app.use((err, req, res, next) => {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
      });
    });

    validToken = jwt.sign({ username: "testuser" }, JWT_SECRET);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /sync", () => {
    it("successfully fetches own data", async () => {
      dataService.findUserByUsername.mockResolvedValue({
        username: "testuser",
        syncData: { favorites: [] }
      });

      const response = await request(app)
        .get("/user/sync")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.syncData).toEqual({ favorites: [] });
      expect(dataService.findUserByUsername).toHaveBeenCalledWith("testuser");
    });

    it("fails when trying to access other user's data via query", async () => {
      const response = await request(app)
        .get("/user/sync?username=otheruser")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para acceder a los datos de otro usuario");
      expect(dataService.findUserByUsername).not.toHaveBeenCalled();
    });

    it("succeeds when req.body is undefined (standard GET without body parsing)", async () => {
      dataService.findUserByUsername.mockResolvedValue({
        username: "testuser",
        syncData: { favorites: [] }
      });

      // No express.json() for this specific app instance to simulate undefined body if middleware was missed,
      // but express.json() ignores GET by default anyway, making req.body = {} usually, but could be undefined.
      // Supertest doesn't send a body with .get()
      const response = await request(app)
        .get("/user/sync")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /sync", () => {
    it("successfully updates own data", async () => {
      dataService.updateUserSyncData.mockResolvedValue({
        username: "testuser",
        syncData: { favorites: ["anime1"], following: [], history: [] }
      });

      const response = await request(app)
        .post("/user/sync")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ favorites: ["anime1"], following: [], history: [] });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Datos sincronizados correctamente");
      expect(dataService.updateUserSyncData).toHaveBeenCalledWith("testuser", {
        favorites: ["anime1"], following: [], history: []
      });
    });

    it("fails when trying to update other user's data via body", async () => {
      const response = await request(app)
        .post("/user/sync")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ username: "otheruser", favorites: ["anime1"] });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No tienes permiso para modificar los datos de otro usuario");
      expect(dataService.updateUserSyncData).not.toHaveBeenCalled();
    });
  });
});
