const express = require("express");

const {
  createTripController,
  getTripsByWorkDayController,
  updateTripController,
  deleteTripController,
} = require("../controllers/tripController");

const router = express.Router();

// Obtener todos los viajes de una jornada
router.get("/", getTripsByWorkDayController);

// Registrar un nuevo viaje
router.post("/", createTripController);

// Editar un viaje existente
router.put("/:id", updateTripController);

// Eliminar un viaje existente
router.delete("/:id", deleteTripController);

module.exports = router;