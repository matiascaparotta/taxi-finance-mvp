const express = require("express");

const {
  createDriver,
  listDrivers,
  resetDriverPassword,
  updateDriverStatus,
} = require("../controllers/driverManagementController");

const router = express.Router();

router.get("/", listDrivers);
router.post("/", createDriver);
router.patch("/:id/status", updateDriverStatus);
router.post("/:id/reset-password", resetDriverPassword);

module.exports = router;
