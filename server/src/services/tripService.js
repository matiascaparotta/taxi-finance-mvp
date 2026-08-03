const {
  createTrip,
  getTripsByWorkDayId,
  getTripById,
  updateTripById,
  updateClosedTripWithAudit,
  deleteTripById,
  deleteClosedTripWithAudit,
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
const {
  authorizeClosedWorkDayCorrection,
} = require("./closedWorkDayCorrectionService");
const driverSettingsRepository = require("../repositories/driverSettingsRepository");

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

  if (auth?.organizationName === "Lic1315" && tripData.commissionCompanyId) {
    const company = await driverSettingsRepository.getActiveCompany(
      Number(auth.organizationId),
      Number(auth.userId),
      Number(tripData.commissionCompanyId)
    );
    if (!company) throw new Error("La empresa de comisión no está disponible");
    normalizedTrip.commissionCompanyName = company.name;
    normalizedTrip.commissionCompanyAmount = Number(company.commissionAmount);
    normalizedTrip.commission = normalizedTrip.commissionCompanyAmount;
  } else {
    normalizedTrip.commissionCompanyName = null;
    normalizedTrip.commissionCompanyAmount = null;
  }

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

  const workDay = await assertWorkDayAccess(
    existingTrip.workDayId,
    getWriteScope(auth)
  );

  const {
    correctionPassword,
    correctionReason,
    ...tripChanges
  } = tripData || {};
  const normalizedTrip = normalizeTripData({
    ...existingTrip,
    ...tripChanges,
  });

  if (workDay.status === "CLOSED") {
    if (Boolean(workDay.isLocked)) {
      throw new Error(
        "Las jornadas históricas importadas están protegidas y no se pueden corregir"
      );
    }

    const authorization =
      await authorizeClosedWorkDayCorrection({
        auth,
        password: correctionPassword,
        reason: correctionReason,
      });

    return await updateClosedTripWithAudit({
      tripId,
      tripData: normalizedTrip,
      workDayId: Number(existingTrip.workDayId),
      organizationId: authorization.organizationId,
      actorUserId: authorization.actorUserId,
      reason: authorization.reason,
      previousData: existingTrip,
    });
  }

  await assertTripBelongsToOpenWorkDay(tripId);

  const updatedTrip = await updateTripById(
    tripId,
    normalizedTrip
  );

  if (!updatedTrip) {
    throw new Error("Viaje no encontrado");
  }

  return updatedTrip;
};

const deleteTripService = async (
  tripId,
  correctionData = {},
  auth = null
) => {
  if (!tripId) {
    throw new Error("El id del viaje es obligatorio");
  }

  const existingTrip = await getTripById(tripId);

  if (!existingTrip) {
    throw new Error("Viaje no encontrado");
  }

  const workDay = await assertWorkDayAccess(
    existingTrip.workDayId,
    getWriteScope(auth)
  );

  if (workDay.status === "CLOSED") {
    if (Boolean(workDay.isLocked)) {
      throw new Error(
        "Las jornadas históricas importadas están protegidas y no se pueden corregir"
      );
    }

    const authorization =
      await authorizeClosedWorkDayCorrection({
        auth,
        password: correctionData?.correctionPassword,
        reason: correctionData?.correctionReason,
      });

    return await deleteClosedTripWithAudit({
      tripId,
      workDayId: Number(existingTrip.workDayId),
      organizationId: authorization.organizationId,
      actorUserId: authorization.actorUserId,
      reason: authorization.reason,
      previousData: existingTrip,
    });
  }

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
