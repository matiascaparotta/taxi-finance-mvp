const express = require("express");
const cors = require("cors");
const path = require("node:path");

const { getAuthConfig } = require("./config/auth");
const { createCorsOptions } = require("./config/cors");
const {
  requireAuthentication,
} = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const tripRoutes = require("./routes/tripRoutes");
const workDaySummaryRoutes = require("./routes/workDaySummaryRoutes");

getAuthConfig();

const app = express();

app.use(cors(createCorsOptions()));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/work-days",
  requireAuthentication,
  workDayRoutes
);
app.use(
  "/api/work-days",
  requireAuthentication,
  workDaySummaryRoutes
);
app.use("/api/trips", requireAuthentication, tripRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

if (process.env.NODE_ENV === "production") {
  const clientDirectory = path.resolve(
    __dirname,
    "../../client/dist"
  );

  app.use(express.static(clientDirectory));
  app.use((req, res, next) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    res.sendFile(path.join(clientDirectory, "index.html"));
  });
}

app.use((error, req, res, next) => {
  if (error.code === "CORS_ORIGIN_DENIED") {
    res.status(403).json({
      message: "Origen no permitido",
    });
    return;
  }

  next(error);
});

module.exports = app;
