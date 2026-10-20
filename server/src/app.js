const express = require("express");
const cors = require("cors");
const path = require("node:path");

const { getAuthConfig } = require("./config/auth");
const { createCorsOptions } = require("./config/cors");
const {
  requireCompletedPasswordChange,
  requireAuthentication,
  requireActiveUserSession,
  requireOwner,
} = require("./middleware/authMiddleware");
const {
  applySecurityHeaders,
  attachRequestId,
} = require("./middleware/securityMiddleware");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const tripRoutes = require("./routes/tripRoutes");
const workDaySummaryRoutes = require("./routes/workDaySummaryRoutes");
const driverManagementRoutes = require(
  "./routes/driverManagementRoutes"
);
const monthlySettlementRoutes = require(
  "./routes/monthlySettlementRoutes"
);
const driverSettingsRoutes = require("./routes/driverSettingsRoutes");
const dailySettlementPaymentRoutes = require(
  "./routes/dailySettlementPaymentRoutes"
);

getAuthConfig();

const app = express();

app.disable("x-powered-by");
app.use(attachRequestId);
app.use(applySecurityHeaders);
app.use(cors(createCorsOptions()));
app.use(express.json({ limit: "64kb" }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/work-days",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  workDayRoutes
);
app.use(
  "/api/work-days",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  workDaySummaryRoutes
);
app.use(
  "/api/trips",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  tripRoutes
);
app.use(
  "/api/drivers",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  requireOwner,
  driverManagementRoutes
);
app.use(
  "/api/driver-settings",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  driverSettingsRoutes
);
app.use(
  "/api/monthly-settlements",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  monthlySettlementRoutes
);
app.use(
  "/api/daily-settlements",
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  dailySettlementPaymentRoutes
);

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

  if (error.type === "entity.too.large") {
    res.status(413).json({
      message: "La solicitud es demasiado grande",
      requestId: req.requestId,
    });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400) {
    res.status(400).json({
      message: "La solicitud contiene datos inválidos",
      requestId: req.requestId,
    });
    return;
  }

  console.error(JSON.stringify({
    level: "error",
    message: "Unhandled request error",
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    error: error?.message || "Unknown error",
  }));

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).json({
    message: "No pudimos completar la operación",
    requestId: req.requestId,
  });
});

module.exports = app;
