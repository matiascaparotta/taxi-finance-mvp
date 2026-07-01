const {
  createTrip,
  getTripsByWorkDayId,
  getTripById,
  updateTripById,
  deleteTripById,
} = require("../repositories/tripRepository");

const createTripService = async (tripData) => {
  const { workDayId, amount, paymentType } = tripData;

  if (!workDayId) throw new Error("El workDayId es obligatorio");
  if (!amount) throw new Error("El importe del viaje es obligatorio");
  if (amount <= 0) throw new Error("El importe debe ser mayor a 0");
  if (!paymentType) throw new Error("El método de pago es obligatorio");
  if (!["cash", "card"].includes(paymentType)) {
    throw new Error("El método de pago debe ser cash o card");
  }

  return await createTrip(tripData);
};

const getTripsByWorkDayService = async (workDayId) => {
  if (!workDayId) throw new Error("El workDayId es obligatorio");

  return await getTripsByWorkDayId(workDayId);
};

const getTripByIdService = async (tripId) => {
  if (!tripId) throw new Error("El id del viaje es obligatorio");

  const trip = await getTripById(tripId);

  if (!trip) throw new Error("Viaje no encontrado");

  return trip;
};

const updateTripService = async (tripId, tripData) => {
  if (!tripId) throw new Error("El id del viaje es obligatorio");

  const { amount, paymentType } = tripData;

  if (!amount) throw new Error("El importe del viaje es obligatorio");
  if (amount <= 0) throw new Error("El importe debe ser mayor a 0");
  if (!paymentType) throw new Error("El método de pago es obligatorio");
  if (!["cash", "card"].includes(paymentType)) {
    throw new Error("El método de pago debe ser cash o card");
  }

  const updatedTrip = await updateTripById(tripId, tripData);

  if (!updatedTrip) throw new Error("Viaje no encontrado");

  return updatedTrip;
};

const deleteTripService = async (tripId) => {
  if (!tripId) throw new Error("El id del viaje es obligatorio");

  const deletedTrip = await deleteTripById(tripId);

  if (!deletedTrip) throw new Error("Viaje no encontrado");

  return deletedTrip;
};

module.exports = {
  createTripService,
  getTripsByWorkDayService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
};