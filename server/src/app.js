const express = require("express");
const cors = require("cors");


const healthRoutes = require("./routes/healthRoutes");
const workDayRoutes = require("./routes/workDayRoutes");
const tripRoutes = require("./routes/tripRoutes");
const workDaySummaryRoutes = require("./routes/workDaySummaryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/work-days", workDayRoutes);
app.use("/work-days", workDaySummaryRoutes);
app.use("/trips", tripRoutes);

module.exports = app;
