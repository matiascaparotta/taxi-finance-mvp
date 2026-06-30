const { getWorkDayWithTrips } = require("../repositories/workDaySummaryRepository");

const roundToTwoDecimals = (value) => {
  return Number(value.toFixed(2));
};

const getWorkDaySummaryService = async (workDayId) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const result = await getWorkDayWithTrips(workDayId);

  if (!result) {
    throw new Error("Jornada no encontrada");
  }

  const { workDay, trips } = result;

  const workedKm = workDay.endKm - workDay.startKm;

  const cash = trips
    .filter((trip) => trip.paymentType === "cash")
    .reduce((total, trip) => {
      return total + Number(trip.amount) + Number(trip.cashAdjustment || 0);
    }, 0);

  const card = trips
    .filter((trip) => trip.paymentType === "card")
    .reduce((total, trip) => {
      return total + Number(trip.amount);
    }, 0);

  const totalRevenue = cash + card;

  const tripCount = trips.length;

  const averageTrip =
    tripCount > 0 ? totalRevenue / tripCount : 0;

  const cashToDeliver =
    cash - Number(workDay.fuelOwn) - Number(workDay.fuelJose);

  return {
    workDayId: workDay.id,
    date: workDay.date,
    startKm: workDay.startKm,
    endKm: workDay.endKm,
    workedKm,

    tripCount,

    cash: roundToTwoDecimals(cash),
    card: roundToTwoDecimals(card),
    totalRevenue: roundToTwoDecimals(totalRevenue),

    fuelOwn: Number(workDay.fuelOwn),
    fuelJose: Number(workDay.fuelJose),

    cashToDeliver: roundToTwoDecimals(cashToDeliver),
    averageTrip: roundToTwoDecimals(averageTrip),
  };
};

module.exports = {
  getWorkDaySummaryService,
};