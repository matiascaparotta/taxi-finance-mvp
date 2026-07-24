const express = require("express");

const {
  createWorkDay,
  getAllWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  closeWorkDay,
  deleteWorkDay,
} = require("../controllers/workDayController");

const router = express.Router();

router.get("/", getAllWorkDays);

router.get("/open", getOpenWorkDay);

router.get("/latest-closed", getLatestClosedWorkDay);

router.get("/:id", getWorkDayById);

router.post("/", createWorkDay);

router.put("/:id/close", closeWorkDay);

router.delete("/:id", deleteWorkDay);

module.exports = router;
