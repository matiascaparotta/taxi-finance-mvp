const {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  getLatestVehicleClosedWorkDay,
  closeWorkDayById,
  deleteWorkDayById,
} = require("../repositories/workDayRepository");
const {
  assertWorkDayCanBeDeleted,
} = require("./workDayProtection");
const { calculateFuelSplit } = require("../utils/fuel");
const { validateStartKm } = require("../utils/odometer");
const {
  validateCloseDate,
  validateChronologicalWorkDayDate,
} = require("../utils/workDayDate");
const {
  getReadScope,
  getWriteScope,
  canManageWorkDay,
} = require("./workDayAccess");

const serializeWorkDay = (workDay, auth, workedKm) => ({
  ...workDay,
  isLocked: Boolean(workDay.isLocked),
  canManage: canManageWorkDay(workDay, auth),
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

  const fuelSplit = calculateFuelSplit(fuelAmount, fuelAllocation);

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

const deleteWorkDayService = async (workDayId, auth = null) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const writeScope = getWriteScope(auth);
  const workDay = await getWorkDayById(workDayId, writeScope);
  assertWorkDayCanBeDeleted(workDay);

  await deleteWorkDayById(workDayId, writeScope);

  return {
    id: Number(workDayId),
  };
};

module.exports = {
  createWorkDayService,
  getWorkDaysService,
  getWorkDayByIdService,
  getOpenWorkDayService,
  getLatestClosedWorkDayService,
  closeWorkDayService,
  deleteWorkDayService,
};
