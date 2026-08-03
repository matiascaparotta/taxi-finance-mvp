const express = require("express");

const {
  createWorkDay,
  getAllWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  closeWorkDay,
  cancelOpenWorkDay,
  deleteWorkDay,
  correctClosedWorkDay,
} = require("../controllers/workDayController");

const router = express.Router();

router.get("/", getAllWorkDays);

router.get("/open", getOpenWorkDay);

router.get("/latest-closed", getLatestClosedWorkDay);

router.get("/:id", getWorkDayById);

router.post("/", createWorkDay);

router.put("/:id/close", closeWorkDay);

router.put("/:id/cancel", cancelOpenWorkDay);

router.put("/:id/correction", correctClosedWorkDay);

router.delete("/:id", deleteWorkDay);

module.exports = router;
