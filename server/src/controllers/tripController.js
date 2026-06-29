const { createTripService } = require("../services/tripService");

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

module.exports = {
  createTripController,
};