const express = require("express");
const controller = require("../controllers/driverSettingsController");
const router = express.Router();
router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);
router.post("/companies", controller.createCompany);
router.put("/companies/:id", controller.updateCompany);
module.exports = router;
