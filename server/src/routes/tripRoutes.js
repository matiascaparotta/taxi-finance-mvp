const express = require("express");
const { createTripController } = require("../controllers/tripController");

const router = express.Router();

router.post("/", createTripController);

module.exports = router;