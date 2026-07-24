const express = require("express");
const cors = require("cors");

const { createCorsOptions } = require("./config/cors");
const {
  requireAuthentication,
} = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const tripRoutes = require("./routes/tripRoutes");
const workDaySummaryRoutes = require("./routes/workDaySummaryRoutes");

const app = express();

app.use(cors(createCorsOptions()));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use(requireAuthentication);
app.use("/work-days", workDayRoutes);
app.use("/work-days", workDaySummaryRoutes);
app.use("/trips", tripRoutes);

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
