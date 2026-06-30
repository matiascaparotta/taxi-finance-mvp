const express = require("express");

const {
  createWorkDay,
  getAllWorkDays,
  getOpenWorkDay,
  closeWorkDay,
} = require("../controllers/workDayController");

const router = express.Router();

router.get("/", getAllWorkDays);

router.post("/", createWorkDay);

router.get("/open", getOpenWorkDay);

router.put("/:id/close", closeWorkDay);

module.exports = router;