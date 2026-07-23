const {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  closeWorkDayById,
} = require("../repositories/workDayRepository");
const { calculateFuelSplit } = require("../utils/fuel");
const { validateStartKm } = require("../utils/odometer");
const { validateCloseDate } = require("../utils/workDayDate");

const createWorkDayService = async (workDayData) => {
  const { date, startKm, resetOdometer = false } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  const openWorkDay = await getOpenWorkDay();

  if (openWorkDay) {
    throw new Error(
      "Ya existe una jornada activa. Debes cerrarla antes de iniciar otra."
    );
  }

  const latestClosedWorkDay = await getLatestClosedWorkDay();
  const validatedStartKm = validateStartKm(
    startKm,
    latestClosedWorkDay?.endKm,
    resetOdometer
  );

  const workDay = await createWorkDay({
    date,
    startKm: validatedStartKm,
  });

  return {
    ...workDay,
    workedKm: null,
  };
};

const getWorkDaysService = async () => {
  const workDays = await getWorkDays();

  return workDays.map((workDay) => ({
    ...workDay,
    workedKm:
      workDay.endKm !== null
        ? workDay.endKm - workDay.startKm
        : null,
  }));
};

const getWorkDayByIdService = async (workDayId) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const workDay = await getWorkDayById(workDayId);

  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  return {
    ...workDay,
    workedKm:
      workDay.endKm !== null
        ? workDay.endKm - workDay.startKm
        : null,
  };
};
const getOpenWorkDayService = async () => {
  const openWorkDay = await getOpenWorkDay();

  if (!openWorkDay) {
    return null;
  }

  return {
    ...openWorkDay,
    workedKm: null,
  };
};

const getLatestClosedWorkDayService = async () => {
  return await getLatestClosedWorkDay();
};

const closeWorkDayService = async (workDayId, closeData) => {
  const { date, endKm, fuelAmount, fuelAllocation } = closeData;

  const openWorkDay = await getOpenWorkDay();

  if (!openWorkDay) {
    throw new Error("No hay una jornada activa para cerrar");
  }

  if (Number(openWorkDay.id) !== Number(workDayId)) {
    throw new Error("La jornada indicada no coincide con la jornada activa");
  }

  const validatedDate = validateCloseDate(date);

  if (endKm === undefined || endKm === null || endKm === "") {
    throw new Error("El kilometraje final es obligatorio");
  }

  if (Number(endKm) < Number(openWorkDay.startKm)) {
    throw new Error("El kilometraje final no puede ser menor al inicial");
  }

  const fuelSplit = calculateFuelSplit(fuelAmount, fuelAllocation);

  const closedWorkDay = await closeWorkDayById(workDayId, {
    date: validatedDate,
    endKm: Number(endKm),
    ...fuelSplit,
  });

  return {
    ...closedWorkDay,
    workedKm: closedWorkDay.endKm - closedWorkDay.startKm,
  };
};

module.exports = {
  createWorkDayService,
  getWorkDaysService,
  getWorkDayByIdService,
  getOpenWorkDayService,
  getLatestClosedWorkDayService,
  closeWorkDayService,
};
