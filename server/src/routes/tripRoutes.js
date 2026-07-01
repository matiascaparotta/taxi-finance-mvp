const express = require("express");

const {
  createTripController,
  getTripsByWorkDayController,
  getTripByIdController,
  updateTripController,
  deleteTripController,
} = require("../controllers/tripController");

const router = express.Router();

// Obtener todos los viajes de una jornada
router.get("/", getTripsByWorkDayController);

// Obtener un viaje por su ID
router.get("/:id", getTripByIdController);

// Registrar un nuevo viaje
router.post("/", createTripController);

// Editar un viaje existente
router.put("/:id", updateTripController);

// Eliminar un viaje existente
router.delete("/:id", deleteTripController);

module.exports = router;