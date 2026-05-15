const fs = require("node:fs/promises");
const path = require("node:path");

const DATA_DIR = path.join(__dirname, "../../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

/**
 * Servicio de persistencia simple basado en JSON.
 * Ideal para proyectos personales en hardware como Orange Pi.
 */
class DataService {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(USERS_FILE);
      } catch {
        await fs.writeFile(USERS_FILE, JSON.stringify([]));
      }
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing data service:", error);
    }
  }

  async getUsers() {
    await this.init();
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  }

  async saveUsers(users) {
    await this.init();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async findUserByUsername(username) {
    const users = await this.getUsers();
    return users.find((u) => u.username === username);
  }

  async addUser(user) {
    const users = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
    return user;
  }

  async updateUserSyncData(username, syncData) {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.username === username);
    if (index !== -1) {
      // Guardar favoritos, siguiendo e historial
      users[index].syncData = {
        ...users[index].syncData,
        ...syncData,
        lastUpdated: new Date().toISOString(),
      };
      await this.saveUsers(users);
      return users[index];
    }
    return null;
  }
}

module.exports = new DataService();
