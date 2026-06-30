const {
  createWorkDay,
  getWorkDays,
} = require("../repositories/workDayRepository");

const createWorkDayService = async (workDayData) => {
  const { date, startKm, endKm, fuelOwn } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  if (startKm === undefined || startKm === null) {
    throw new Error("El kilometraje inicial es obligatorio");
  }

  if (endKm === undefined || endKm === null) {
    throw new Error("El kilometraje final es obligatorio");
  }

  if (endKm < startKm) {
    throw new Error("El kilometraje final no puede ser menor al inicial");
  }

  if (fuelOwn === undefined || fuelOwn === null) {
    throw new Error("La gasolina propia es obligatoria");
  }

  if (fuelOwn < 0) {
    throw new Error("La gasolina propia no puede ser negativa");
  }

  const workDay = await createWorkDay(workDayData);

  return {
    ...workDay,
    workedKm: workDay.endKm - workDay.startKm,
  };
};

const getWorkDaysService = async () => {
  const workDays = await getWorkDays();

  return workDays.map((workDay) => ({
    ...workDay,
    workedKm: workDay.endKm - workDay.startKm,
  }));
};

module.exports = {
  createWorkDayService,
  getWorkDaysService,
};