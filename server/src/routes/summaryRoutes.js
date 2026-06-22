const express = require("express");

const {
  getMonthlySummaryController,
} = require("../controllers/summaryController");

const router = express.Router();

router.get("/monthly", getMonthlySummaryController);

module.exports = router;