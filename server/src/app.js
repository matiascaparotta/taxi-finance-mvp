const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/work-days", workDayRoutes);
app.use("/summary", summaryRoutes);

module.exports = app;