const {
  createTripService,
  getTripsByWorkDayService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
} = require("../services/tripService");

const createTripController = async (req, res) => {
  try {
    const trip = await createTripService(req.body);

    res.status(201).json({
      success: true,
      message: "Viaje registrado correctamente",
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getTripByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await getTripByIdService(id);

    res.status(200).json({
      success: true,
      message: "Viaje obtenido correctamente",
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const getTripsByWorkDayController = async (req, res) => {
  try {
    const { workDayId } = req.query;

    const trips = await getTripsByWorkDayService(workDayId);

    res.status(200).json({
      success: true,
      message: "Viajes obtenidos correctamente",
      data: trips,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const updateTripController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTrip = await updateTripService(id, req.body);

    res.status(200).json({
      success: true,
      message: "Viaje actualizado correctamente",
      data: updatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteTripController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTrip = await deleteTripService(id);

    res.status(200).json({
      success: true,
      message: "Viaje eliminado correctamente",
      data: deletedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTripController,
  getTripsByWorkDayController,
  getTripByIdController,
  updateTripController,
  deleteTripController,
};