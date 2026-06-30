const {
  createWorkDay,
  getWorkDays,
  getOpenWorkDay,
  closeWorkDayById,
} = require("../repositories/workDayRepository");
const createWorkDayService = async (workDayData) => {
  const { date, startKm } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  if (startKm === undefined || startKm === null || startKm === "") {
    throw new Error("El kilometraje inicial es obligatorio");
  }

  if (Number(startKm) < 0) {
    throw new Error("El kilometraje inicial no puede ser negativo");
  }

  const openWorkDay = await getOpenWorkDay();

  if (openWorkDay) {
    throw new Error(
      "Ya existe una jornada activa. Debes cerrarla antes de iniciar otra."
    );
  }

  const workDay = await createWorkDay({
    date,
    startKm: Number(startKm),
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

const closeWorkDayService = async (workDayId, closeData) => {
  const { endKm, fuelOwn } = closeData;

  const openWorkDay = await getOpenWorkDay();

  if (!openWorkDay) {
    throw new Error("No hay una jornada activa para cerrar");
  }

  if (Number(openWorkDay.id) !== Number(workDayId)) {
    throw new Error("La jornada indicada no coincide con la jornada activa");
  }

  if (endKm === undefined || endKm === null || endKm === "") {
    throw new Error("El kilometraje final es obligatorio");
  }

  if (Number(endKm) < Number(openWorkDay.startKm)) {
    throw new Error("El kilometraje final no puede ser menor al inicial");
  }

  if (fuelOwn === undefined || fuelOwn === null || fuelOwn === "") {
    throw new Error("El combustible es obligatorio. Si no cargaste, usa 0");
  }

  if (Number(fuelOwn) < 0) {
    throw new Error("El combustible no puede ser negativo");
  }

  const closedWorkDay = await closeWorkDayById(workDayId, {
    endKm: Number(endKm),
    fuelOwn: Number(fuelOwn),
  });

  return {
    ...closedWorkDay,
    workedKm: closedWorkDay.endKm - closedWorkDay.startKm,
  };
};

module.exports = {
  createWorkDayService,
  getWorkDaysService,
  getOpenWorkDayService,
  closeWorkDayService,
};