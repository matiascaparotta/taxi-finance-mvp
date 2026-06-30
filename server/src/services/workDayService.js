const {
  createWorkDay,
  getWorkDays,
  getOpenWorkDay,
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

module.exports = {
  createWorkDayService,
  getWorkDaysService,
  getOpenWorkDayService,
};