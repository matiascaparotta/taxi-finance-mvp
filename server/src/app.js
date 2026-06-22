const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/work-days", workDayRoutes);

module.exports = app;