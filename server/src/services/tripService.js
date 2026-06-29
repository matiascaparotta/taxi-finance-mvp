const { createTrip } = require("./tripRepository");

const createTripService = async (tripData) => {
  const { workDayId, amount, paymentType } = tripData;

  if (!workDayId) {
    throw new Error("El workDayId es obligatorio");
  }

  if (!amount) {
    throw new Error("El importe del viaje es obligatorio");
  }

  if (amount <= 0) {
    throw new Error("El importe debe ser mayor a 0");
  }

  if (!paymentType) {
    throw new Error("El método de pago es obligatorio");
  }

  if (!["cash", "card"].includes(paymentType)) {
    throw new Error("El método de pago debe ser cash o card");
  }

  const trip = await createTrip(tripData);

  return trip;
};

module.exports = {
  createTripService,
};