const express = require("express");

const {
  createWorkDay,
  getAllWorkDays,
  getOpenWorkDay,
} = require("../controllers/workDayController");

const router = express.Router();

router.get("/", getAllWorkDays);
router.get("/open", getOpenWorkDay);

router.post("/", createWorkDay);

module.exports = router;