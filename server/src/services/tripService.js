const {
  createTrip,
  getTripsByWorkDayId,
  updateTripById,
} = require("../repositories/tripRepository");

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

const getTripsByWorkDayService = async (workDayId) => {
  if (!workDayId) {
    throw new Error("El workDayId es obligatorio");
  }

  const trips = await getTripsByWorkDayId(workDayId);

  return trips;
};
const updateTripService = async (tripId, tripData) => {
  if (!tripId) {
    throw new Error("El id del viaje es obligatorio");
  }

  const { amount, paymentType } = tripData;

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

  const updatedTrip = await updateTripById(tripId, tripData);

  if (!updatedTrip) {
    throw new Error("Viaje no encontrado");
  }

  return updatedTrip;
};
module.exports = {
  createTripService,
  getTripsByWorkDayService,
  updateTripService,
};