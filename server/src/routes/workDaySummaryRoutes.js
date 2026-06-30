const express = require("express");

const {
  getWorkDaySummaryController,
} = require("../controllers/workDaySummaryController");

const router = express.Router();

router.get("/:id/summary", getWorkDaySummaryController);

module.exports = router;