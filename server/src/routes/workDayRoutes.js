const express = require("express");
const { createWorkDay } = require("../controllers/workDayController");

const router = express.Router();

router.post("/", createWorkDay);

module.exports = router;