const express = require("express");

const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const tripRoutes = require("./routes/tripRoutes");
const workDaySummaryRoutes = require("./routes/workDaySummaryRoutes");
const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/work-days", workDayRoutes);
app.use("/summary", summaryRoutes);
app.use("/trips", tripRoutes);
app.use("/work-days", workDaySummaryRoutes);

module.exports = app;