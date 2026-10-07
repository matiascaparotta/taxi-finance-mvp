const {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
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

const createWorkDayService = async (userId, workDayData) => {
  const { date, startKm, resetOdometer = false } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  const openWorkDay = await getOpenWorkDay(userId);

  if (openWorkDay) {
    throw new Error(
      "Ya existe una jornada activa. Debes cerrarla antes de iniciar otra."
    );
  }

  const latestClosedWorkDay = await getLatestClosedWorkDay(userId);
  const validatedDate = validateChronologicalWorkDayDate(
    date,
    latestClosedWorkDay?.date
  );
  const validatedStartKm = validateStartKm(
    startKm,
    latestClosedWorkDay?.endKm,
    resetOdometer
  );

  const workDay = await createWorkDay(userId, {
    date: validatedDate,
    startKm: validatedStartKm,
  });

  return {
    ...workDay,
    isLocked: Boolean(workDay.isLocked),
    workedKm: null,
  };
};

const getWorkDaysService = async (userId) => {
  const workDays = await getWorkDays(userId);

  return workDays.map((workDay) => ({
    ...workDay,
    isLocked: Boolean(workDay.isLocked),
    workedKm:
      workDay.endKm !== null
        ? workDay.endKm - workDay.startKm
        : null,
  }));
};

const getWorkDayByIdService = async (userId, workDayId) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const workDay = await getWorkDayById(userId, workDayId);

  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  return {
    ...workDay,
    isLocked: Boolean(workDay.isLocked),
    workedKm:
      workDay.endKm !== null
        ? workDay.endKm - workDay.startKm
        : null,
  };
};
const getOpenWorkDayService = async (userId) => {
  const openWorkDay = await getOpenWorkDay(userId);

  if (!openWorkDay) {
    return null;
  }

  return {
    ...openWorkDay,
    isLocked: Boolean(openWorkDay.isLocked),
    workedKm: null,
  };
};

const getLatestClosedWorkDayService = async (userId) => {
  return await getLatestClosedWorkDay(userId);
};

const closeWorkDayService = async (userId, workDayId, closeData) => {
  const { date, endKm, fuelAmount, fuelAllocation } = closeData;

  const openWorkDay = await getOpenWorkDay(userId);

  if (!openWorkDay) {
    throw new Error("No hay una jornada activa para cerrar");
  }

  if (Number(openWorkDay.id) !== Number(workDayId)) {
    throw new Error("La jornada indicada no coincide con la jornada activa");
  }

  const validatedDate = validateCloseDate(date);
  const latestClosedWorkDay = await getLatestClosedWorkDay(userId);
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

  const closedWorkDay = await closeWorkDayById(userId, workDayId, {
    date: validatedDate,
    endKm: Number(endKm),
    ...fuelSplit,
  });

  return {
    ...closedWorkDay,
    isLocked: Boolean(closedWorkDay.isLocked),
    workedKm: closedWorkDay.endKm - closedWorkDay.startKm,
  };
};

const deleteWorkDayService = async (userId, workDayId) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const workDay = await getWorkDayById(userId, workDayId);
  assertWorkDayCanBeDeleted(workDay);

  await deleteWorkDayById(userId, workDayId);

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
