require("dotenv").config();

const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const animeRoutes = require("./routes/anime.routes");
const downloadService = require("./services/download.service");
const { ApiError } = require("./utils/api-error");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "https:", "blob:"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'self'", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    // En desarrollo, permitir cualquier origen para acceso por red local
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }

    // Validar contra whitelist exacta en producción
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (allowedOrigins.includes("*")) {
      // Advertencia en logs de producción
      console.warn("⚠️ ALERTA DE SEGURIDAD: CORS está configurado para permitir todos los orígenes '*' en producción.");
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por las políticas de seguridad de CORS de AniRD"));
    }
  },
};

app.use(cors(corsOptions));

// Inyectar protección de Rate Limiting por IP para proteger el hardware de la Orange Pi
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 150, // Límite de 150 peticiones por ventana de 15 min por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiadas peticiones desde esta dirección IP. Por favor intenta de nuevo en 15 minutos.",
  },
  skip: () => process.env.DISABLE_RATE_LIMIT === "true",
});

app.use("/api/", apiLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const downloadsDir = downloadService.getDownloadsDir();
const staticDownloadOptions = {
  index: false,
  fallthrough: false,
  setHeaders: (res, filePath) => {
    res.setHeader("Content-Disposition", `attachment; filename=\"${path.basename(filePath)}\"`);
  },
};

app.use("/downloads", express.static(downloadsDir, staticDownloadOptions));
app.use("/api/downloads", express.static(downloadsDir, staticDownloadOptions));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Anime1v API backend reconstruido",
    version: "1.0.0",
    endpoints: {
      modern: ["/api/v1/anime/search", "/api/v1/anime/info", "/api/v1/anime/episode"],
      legacy: ["/api/anime1v/search", "/api/anime1v/info", "/api/anime1v/episode"],
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.use("/api/v1/anime", animeRoutes);
app.use("/api/anime1v", animeRoutes);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Endpoint no encontrado"));
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.message || "Error interno del servidor",
  };

  if (process.env.NODE_ENV !== "production" && error.details) {
    response.error = error.details;
  }

  res.status(statusCode).json(response);
});

app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`AniRD API listening on port ${port} (All interfaces)`);
});
