const express = require("express");

const {
  createTripController,
  getTripsByWorkDayController,
  updateTripController,
} = require("../controllers/tripController");

const router = express.Router();

// Obtener todos los viajes de una jornada
router.get("/", getTripsByWorkDayController);

// Registrar un nuevo viaje
router.post("/", createTripController);

// Editar un viaje existente
router.put("/:id", updateTripController);

module.exports = router;