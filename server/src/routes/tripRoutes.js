const express = require("express");

const {
  createTripController,
  getTripsByWorkDayController,
} = require("../controllers/tripController");

const router = express.Router();

// Obtener todos los viajes de una jornada
router.get("/", getTripsByWorkDayController);

// Registrar un nuevo viaje
router.post("/", createTripController);

module.exports = router;