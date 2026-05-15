const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dataService = require("../services/data.service");
const { ApiError } = require("../utils/api-error");

const JWT_SECRET = process.env.JWT_SECRET || "anird-secret-key-127";

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Token no proporcionado"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch (error) {
    next(new ApiError(401, "Token inválido o expirado"));
  }
};

// Obtener datos de sincronización
router.get("/sync", authMiddleware, async (req, res, next) => {
  try {
    const user = await dataService.findUserByUsername(req.username);
    if (!user) throw new ApiError(404, "Usuario no encontrado");

    res.json({
      success: true,
      syncData: user.syncData,
    });
  } catch (error) {
    next(error);
  }
});

// Guardar/Actualizar datos de sincronización
router.post("/sync", authMiddleware, async (req, res, next) => {
  try {
    const { favorites, following, history } = req.body;
    
    const updatedUser = await dataService.updateUserSyncData(req.username, {
      favorites,
      following,
      history,
    });

    if (!updatedUser) throw new ApiError(404, "Usuario no encontrado");

    res.json({
      success: true,
      message: "Datos sincronizados correctamente",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
