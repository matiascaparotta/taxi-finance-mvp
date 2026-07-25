const express = require("express");

const {
  createDriver,
  listDrivers,
  updateDriverStatus,
} = require("../controllers/driverManagementController");

const router = express.Router();

router.get("/", listDrivers);
router.post("/", createDriver);
router.patch("/:id/status", updateDriverStatus);

module.exports = router;
