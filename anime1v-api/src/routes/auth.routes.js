const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dataService = require("../services/data.service");
const { ApiError } = require("../utils/api-error");

const JWT_SECRET = process.env.JWT_SECRET || "anird-secret-key-127";

// Registro
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Usuario y contraseña son requeridos");
    }

    const existingUser = await dataService.findUserByUsername(username);
    if (existingUser) {
      throw new ApiError(400, "El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      syncData: {
        favorites: [],
        following: [],
        history: [],
      },
    };

    await dataService.addUser(newUser);

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({
      success: true,
      token,
      user: { username: newUser.username },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await dataService.findUserByUsername(username);
    if (!user) {
      throw new ApiError(401, "Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Credenciales inválidas");
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      token,
      user: { username: user.username },
      syncData: user.syncData,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
