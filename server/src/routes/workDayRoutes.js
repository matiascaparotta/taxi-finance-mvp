const express = require("express");

const {
  createWorkDay,
  getAllWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  closeWorkDay,
} = require("../controllers/workDayController");

const router = express.Router();

router.get("/", getAllWorkDays);

router.get("/open", getOpenWorkDay);

router.get("/latest-closed", getLatestClosedWorkDay);

router.get("/:id", getWorkDayById);

router.post("/", createWorkDay);

router.put("/:id/close", closeWorkDay);

module.exports = router;
