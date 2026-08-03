const {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  getLatestVehicleClosedWorkDay,
  closeWorkDayById,
  cancelOpenWorkDayWithAudit,
  deleteWorkDayWithAudit,
  getClosedWorkDayCorrectionContext,
  updateClosedWorkDayWithAudit,
} = require("../repositories/workDayRepository");
const {
  getTripsByWorkDayId,
} = require("../repositories/tripRepository");
const {
  assertWorkDayCanBeDeleted,
  validateWorkDayDeletionConfirmation,
} = require("./workDayProtection");
const {
  calculateFuelSplit,
  resolveFuelAllocation,
} = require("../utils/fuel");
const { validateStartKm } = require("../utils/odometer");
const {
  validateCorrectedKilometres,
} = require("../utils/closedWorkDayCorrection");
const {
  authorizeClosedWorkDayCorrection,
} = require("./closedWorkDayCorrectionService");
const {
  validateCloseDate,
  validateChronologicalWorkDayDate,
  resolveCorrectionDate,
} = require("../utils/workDayDate");
const {
  getReadScope,
  getWriteScope,
  canManageWorkDay,
} = require("./workDayAccess");
const {
  assertActiveWorkDayCanBeCancelled,
  getCancellationActor,
  validateCancellationConfirmation,
} = require("./activeWorkDayCancellation");

const serializeWorkDay = (workDay, auth, workedKm) => ({
  ...workDay,
  isLocked: Boolean(workDay.isLocked),
  canManage: canManageWorkDay(workDay, auth),
  canCorrect:
    auth?.accessMode === "user" &&
    canManageWorkDay(workDay, auth) &&
    !Boolean(workDay.isLocked),
  workedKm,
});

const createWorkDayService = async (workDayData, auth = null) => {
  const writeScope = getWriteScope(auth);
  const { date, startKm, resetOdometer = false } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  const openWorkDay = await getOpenWorkDay(writeScope);

  if (openWorkDay) {
    throw new Error(
      "Ya existe una jornada activa. Debes cerrarla antes de iniciar otra."
    );
  }

  const latestClosedWorkDay = await getLatestClosedWorkDay(writeScope);
  const latestVehicleWorkDay =
    await getLatestVehicleClosedWorkDay(writeScope);
  const validatedDate = validateChronologicalWorkDayDate(
    date,
    latestClosedWorkDay?.date
  );
  const validatedStartKm = validateStartKm(
    startKm,
    latestVehicleWorkDay?.endKm,
    resetOdometer
  );

  const workDay = await createWorkDay(
    {
      date: validatedDate,
      startKm: validatedStartKm,
    },
    writeScope
  );

  return serializeWorkDay(workDay, auth, null);
};

const getWorkDaysService = async (auth = null) => {
  const workDays = await getWorkDays(getReadScope(auth));

  return workDays.map((workDay) =>
    serializeWorkDay(
      workDay,
      auth,
      workDay.endKm !== null
        ? workDay.endKm - workDay.startKm
        : null
    )
  );
};

const getWorkDayByIdService = async (workDayId, auth = null) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const workDay = await getWorkDayById(workDayId, getReadScope(auth));

  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  return serializeWorkDay(
    workDay,
    auth,
    workDay.endKm !== null
      ? workDay.endKm - workDay.startKm
      : null
  );
};
const getOpenWorkDayService = async (auth = null) => {
  const openWorkDay = await getOpenWorkDay(getWriteScope(auth));

  if (!openWorkDay) {
    return null;
  }

  return serializeWorkDay(openWorkDay, auth, null);
};

const getLatestClosedWorkDayService = async (auth = null) => {
  return await getLatestClosedWorkDay(getWriteScope(auth));
};

const closeWorkDayService = async (workDayId, closeData, auth = null) => {
  const writeScope = getWriteScope(auth);
  const { date, endKm, fuelAmount, fuelAllocation } = closeData;

  const openWorkDay = await getOpenWorkDay(writeScope);

  if (!openWorkDay) {
    throw new Error("No hay una jornada activa para cerrar");
  }

  if (Number(openWorkDay.id) !== Number(workDayId)) {
    throw new Error("La jornada indicada no coincide con la jornada activa");
  }

  const validatedDate = validateCloseDate(date);
  const latestClosedWorkDay = await getLatestClosedWorkDay(writeScope);
  validateChronologicalWorkDayDate(
    validatedDate,
    latestClosedWorkDay?.date
  );

  if (endKm === undefined || endKm === null || endKm === "") {
    throw new Error("El kilometraje final es obligatorio");
  }

  if (Number(endKm) < Number(openWorkDay.startKm)) {
    throw new Error("El kilometraje final no puede ser menor al inicial");
  }

  const distanceFuelMode =
    auth?.fuelCalculationMode === "DISTANCE_RATE";
  const workedKm = Number(endKm) - Number(openWorkDay.startKm);
  const effectiveFuelAmount = distanceFuelMode
    ? Number((workedKm * Number(auth?.fuelRatePerKm || 0)).toFixed(2))
    : fuelAmount;
  if (distanceFuelMode && !(Number(auth?.fuelRatePerKm) > 0)) {
    throw new Error("La tarifa de combustible por kilómetro no está configurada");
  }
  const effectiveFuelAllocation = distanceFuelMode
    ? "OWN"
    : resolveFuelAllocation(
      fuelAllocation,
      {
        isOwner: Boolean(
          auth?.roles?.isOwner ?? auth?.isOwner
        ),
      }
    );
  const fuelSplit = calculateFuelSplit(
    effectiveFuelAmount,
    effectiveFuelAllocation
  );

  const closedWorkDay = await closeWorkDayById(
    workDayId,
    {
      date: validatedDate,
      endKm: Number(endKm),
      ...fuelSplit,
    },
    writeScope
  );

  return serializeWorkDay(
    closedWorkDay,
    auth,
    closedWorkDay.endKm - closedWorkDay.startKm
  );
};

const cancelOpenWorkDayService = async (
  workDayId,
  cancellationData = {},
  auth = null
) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const writeScope = getWriteScope(auth);
  const workDay = await getWorkDayById(workDayId, writeScope);
  assertActiveWorkDayCanBeCancelled(workDay);
  validateCancellationConfirmation(
    cancellationData?.cancellationConfirmation
  );

  const actor = getCancellationActor(auth);
  const trips = await getTripsByWorkDayId(workDayId);
  const hasTrips = trips.length > 0;
  let reason = "Jornada activa vacía cancelada por el usuario";

  if (hasTrips) {
    const authorization = await authorizeClosedWorkDayCorrection({
      auth,
      password: cancellationData?.cancellationPassword,
      reason: cancellationData?.cancellationReason,
    });
    reason = authorization.reason;
  }

  return cancelOpenWorkDayWithAudit({
    workDayId: Number(workDayId),
    ...actor,
    reason,
    requireEmpty: !hasTrips,
  });
};

const deleteWorkDayService = async (workDayId, deletionData = {}, auth = null) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const writeScope = getWriteScope(auth);
  const workDay = await getWorkDayById(workDayId, writeScope);
  assertWorkDayCanBeDeleted(workDay);
  validateWorkDayDeletionConfirmation(
    deletionData?.deletionConfirmation
  );

  const authorization = await authorizeClosedWorkDayCorrection({
    auth,
    password: deletionData?.correctionPassword,
    reason: deletionData?.correctionReason,
  });

  await deleteWorkDayWithAudit({
    workDayId: Number(workDayId),
    organizationId: authorization.organizationId,
    actorUserId: authorization.actorUserId,
    reason: authorization.reason,
    previousData: workDay,
  });

  return {
    id: Number(workDayId),
  };
};

const correctClosedWorkDayService = async (
  workDayId,
  correctionData,
  auth = null
) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const writeScope = getWriteScope(auth);
  const workDay = await getWorkDayById(workDayId, writeScope);

  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  if (workDay.status !== "CLOSED") {
    throw new Error("Solo se pueden corregir jornadas cerradas");
  }

  if (Boolean(workDay.isLocked)) {
    throw new Error(
      "Las jornadas históricas importadas están protegidas y no se pueden corregir"
    );
  }

  const authorization = await authorizeClosedWorkDayCorrection({
    auth,
    password: correctionData?.correctionPassword,
    reason: correctionData?.correctionReason,
  });
  const correctedDate = resolveCorrectionDate(
    correctionData?.date,
    workDay.date
  );
  const correctionContext = await getClosedWorkDayCorrectionContext(
    workDayId,
    correctedDate
  );

  if (correctionContext.hasDuplicateDriverDate) {
    throw new Error("Ya existe otra jornada tuya con esa fecha");
  }

  const kilometres = validateCorrectedKilometres({
    startKm: correctionData?.startKm,
    endKm: correctionData?.endKm,
    previousEndKm: correctionContext.previous?.endKm ?? null,
    nextStartKm: correctionContext.next?.startKm ?? null,
  });
  const effectiveFuelAllocation = resolveFuelAllocation(
    correctionData?.fuelAllocation,
    {
      isOwner: Boolean(auth?.roles?.isOwner ?? auth?.isOwner),
    }
  );
  const fuel = calculateFuelSplit(
    correctionData?.fuelAmount,
    effectiveFuelAllocation
  );

  const corrected = await updateClosedWorkDayWithAudit({
    workDayId: Number(workDayId),
    organizationId: authorization.organizationId,
    actorUserId: authorization.actorUserId,
    reason: authorization.reason,
    previousData: workDay,
    correctedData: {
      date: correctedDate,
      ...kilometres,
      ...fuel,
    },
  });

  return serializeWorkDay(
    corrected,
    auth,
    corrected.endKm - corrected.startKm
  );
};

module.exports = {
  createWorkDayService,
  getWorkDaysService,
  getWorkDayByIdService,
  getOpenWorkDayService,
  getLatestClosedWorkDayService,
  closeWorkDayService,
  cancelOpenWorkDayService,
  deleteWorkDayService,
  correctClosedWorkDayService,
};
