const {
  createTrip,
  getTripsByWorkDayId,
  getTripById,
  updateTripById,
  deleteTripById,
} = require("../repositories/tripRepository");
const {
  assertTripBelongsToOpenWorkDay,
} = require("./workDayStatusGuard");
const {
  getReadScope,
  getWriteScope,
} = require("./workDayAccess");
const {
  getWorkDayById,
} = require("../repositories/workDayRepository");

const assertWorkDayAccess = async (workDayId, scope) => {
  const workDay = await getWorkDayById(workDayId, scope);

  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  return workDay;
};

const parsePositiveAmount = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error("El importe debe ser un número válido");
  }

  if (numericValue <= 0) {
    throw new Error("El importe debe ser mayor a 0");
  }

  return Number(numericValue.toFixed(2));
};

const parseNonNegativeAmount = (value, fieldName) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`${fieldName} debe ser un número válido`);
  }

  if (numericValue < 0) {
    throw new Error(`${fieldName} no puede ser negativo`);
  }

  return Number(numericValue.toFixed(2));
};

const normalizeTripData = (tripData) => {
  const amount = parsePositiveAmount(tripData.amount);

  const commission = parseNonNegativeAmount(
    tripData.commission,
    "La comisión"
  );

  const tip = parseNonNegativeAmount(
    tripData.tip,
    "La propina"
  );

  const cashAdjustment = parseNonNegativeAmount(
    tripData.cashAdjustment,
    "El ajuste de efectivo"
  );

  const paymentType = tripData.paymentType;

  if (!paymentType) {
    throw new Error("El método de pago es obligatorio");
  }

  if (!["cash", "card"].includes(paymentType)) {
    throw new Error("El método de pago debe ser cash o card");
  }

  return {
    ...tripData,
    amount,
    paymentType,
    commission,
    tip,
    note: tripData.note?.trim() || null,
    cashAdjustment,
    adjustmentReason:
      tripData.adjustmentReason?.trim() || null,
  };
};

const createTripService = async (tripData, auth = null) => {
  if (!tripData.workDayId) {
    throw new Error("El workDayId es obligatorio");
  }

  await assertWorkDayAccess(
    tripData.workDayId,
    getWriteScope(auth)
  );

  const normalizedTrip = normalizeTripData(tripData);

  return await createTrip(normalizedTrip);
};

const getTripsByWorkDayService = async (workDayId, auth = null) => {
  if (!workDayId) {
    throw new Error("El workDayId es obligatorio");
  }

  await assertWorkDayAccess(workDayId, getReadScope(auth));

  return await getTripsByWorkDayId(workDayId);
};

const getTripByIdService = async (tripId, auth = null) => {
  if (!tripId) {
    throw new Error("El id del viaje es obligatorio");
  }

  const trip = await getTripById(tripId);

  if (!trip) {
    throw new Error("Viaje no encontrado");
  }

  await assertWorkDayAccess(trip.workDayId, getReadScope(auth));

  return trip;
};

const updateTripService = async (tripId, tripData, auth = null) => {
  if (!tripId) {
    throw new Error("El id del viaje es obligatorio");
  }

  const existingTrip = await getTripById(tripId);

  if (!existingTrip) {
    throw new Error("Viaje no encontrado");
  }

  await assertWorkDayAccess(
    existingTrip.workDayId,
    getWriteScope(auth)
  );

  await assertTripBelongsToOpenWorkDay(tripId);

  const normalizedTrip = normalizeTripData({
    ...existingTrip,
    ...tripData,
  });

  const updatedTrip = await updateTripById(
    tripId,
    normalizedTrip
  );

  if (!updatedTrip) {
    throw new Error("Viaje no encontrado");
  }

  return updatedTrip;
};

const deleteTripService = async (tripId, auth = null) => {
  if (!tripId) {
    throw new Error("El id del viaje es obligatorio");
  }

  const existingTrip = await getTripById(tripId);

  if (!existingTrip) {
    throw new Error("Viaje no encontrado");
  }

  await assertWorkDayAccess(
    existingTrip.workDayId,
    getWriteScope(auth)
  );

  await assertTripBelongsToOpenWorkDay(tripId);

  const deletedTrip = await deleteTripById(tripId);

  return deletedTrip;
};

module.exports = {
  createTripService,
  getTripsByWorkDayService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
};
