const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Taxi Finance API running",
  });
});

module.exports = app;