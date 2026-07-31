/**
 * Tests básicos para autenticación
 * Ejecutar: npm test
 */

const request = require('supertest');

// Mock del data service antes de importar el servidor
jest.mock('../src/services/data.service', () => ({
  initialized: true,
  init: jest.fn().mockResolvedValue(undefined),
  getUsers: jest.fn().mockResolvedValue([]),
  saveUsers: jest.fn().mockResolvedValue(undefined),
  findUserByUsername: jest.fn().mockResolvedValue(null),
  addUser: jest.fn().mockImplementation((user) => Promise.resolve(user)),
  updateUserSyncData: jest.fn().mockResolvedValue(null),
}));

const dataServiceMock = require('../src/services/data.service');

// Configurar JWT_SECRET para tests
process.env.JWT_SECRET = 'test-jwt-secret-key-for-unit-tests-only';

const app = require('../src/server');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('debe retornar error si no se provee username', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ password: 'test123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Usuario y contraseña');
    });

    it('debe retornar error si no se provee password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: 'testuser' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Usuario y contraseña');
    });

    it('debe registrar un usuario exitosamente', async () => {
      dataServiceMock.findUserByUsername.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: 'newuser', password: 'securepass123' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe('newuser');
    });

    it('debe retornar error si el usuario ya existe', async () => {
      dataServiceMock.findUserByUsername.mockResolvedValue({
        username: 'existinguser',
        password: 'hashedpass',
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: 'existinguser', password: 'newpass123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('ya existe');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('debe retornar error con credenciales inválidas (usuario no existe)', async () => {
      dataServiceMock.findUserByUsername.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'nonexistent', password: 'anypass' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('inválidas');
    });

    it('debe retornar error con password incorrecto', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('correctpassword', 12);

      dataServiceMock.findUserByUsername.mockResolvedValue({
        username: 'testuser',
        password: hashedPassword,
        syncData: { favorites: [], following: [], history: [] },
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('inválidas');
    });

    it('debe hacer login exitosamente', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('correctpassword', 12);

      dataServiceMock.findUserByUsername.mockResolvedValue({
        username: 'testuser',
        password: hashedPassword,
        syncData: { favorites: [], following: [], history: [] },
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'correctpassword' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.syncData).toBeDefined();
    });
  });
});
