const express = require("express");
const {
    createWorkDay,
    getAllWorkDays,
  } = require("../controllers/workDayController");
  
const router = express.Router();
router.get("/", getAllWorkDays);
router.post("/", createWorkDay);

module.exports = router;