const {
  getWorkDayWithTrips,
} = require("../repositories/workDaySummaryRepository");
const {
  getWorkDayById,
} = require("../repositories/workDayRepository");
const { getReadScope } = require("./workDayAccess");
const {
  calculateDailySettlement,
} = require("../utils/dailySettlement");

const roundToTwoDecimals = (value) => {
  return Number(Number(value || 0).toFixed(2));
};

const buildDailySettlement = ({
  auth,
  dailySettlementSnapshot,
  endKm,
  fuelOwn,
  realCash,
  totalRevenue,
}) => {
  if (dailySettlementSnapshot) {
    return {
      ...dailySettlementSnapshot,
      netRevenue: Number(dailySettlementSnapshot.netRevenue),
      cashRetained: Number(dailySettlementSnapshot.cashRetained),
      fuelCost: Number(dailySettlementSnapshot.fuelCost),
      socialSecurity: Number(dailySettlementSnapshot.socialSecurity),
      driverShareBasisPoints: Number(
        dailySettlementSnapshot.driverShareBasisPoints
      ),
      driverSharePercentage:
        Number(dailySettlementSnapshot.driverShareBasisPoints) / 100,
      distributableBase: Number(dailySettlementSnapshot.distributableBase),
      driverShare: Number(dailySettlementSnapshot.driverShare),
      ownerShare: Number(dailySettlementSnapshot.ownerShare),
      reimbursableFuel: Number(dailySettlementSnapshot.reimbursableFuel),
      driverEntitlement: Number(dailySettlementSnapshot.driverEntitlement),
      balance: Number(dailySettlementSnapshot.balance),
      pendingBalance: Number(dailySettlementSnapshot.pendingBalance),
    };
  }

  if (
    auth?.accessMode !== "user" ||
    auth?.settlementMode !== "DAILY_50_50" ||
    endKm === null ||
    endKm === undefined
  ) {
    return null;
  }

  return calculateDailySettlement({
    netRevenue: totalRevenue,
    cashRetained: realCash,
    fuelCost: fuelOwn,
    socialSecurity: auth.dailySocialSecurity,
    driverShareBasisPoints: auth.driverShareBasisPoints,
  });
};

const getWorkDaySummaryService = async (workDayId, auth = null) => {
  if (!workDayId) {
    throw new Error("El id de la jornada es obligatorio");
  }

  const accessibleWorkDay = await getWorkDayById(
    workDayId,
    getReadScope(auth)
  );

  if (!accessibleWorkDay) {
    throw new Error("Jornada no encontrada");
  }

  const result = await getWorkDayWithTrips(workDayId);

  if (!result) {
    throw new Error("Jornada no encontrada");
  }

  const {
    workDay,
    trips,
    importedSummary,
    dailySettlementSnapshot,
  } = result;

  const startKm = Number(workDay.startKm || 0);
  const endKm = Number(workDay.endKm || 0);

  const workedKm = endKm - startKm;

  const cash = trips
    .filter((trip) => trip.paymentType === "cash")
    .reduce((total, trip) => {
      return total + Number(trip.amount || 0);
    }, 0);

  const card = trips
    .filter((trip) => trip.paymentType === "card")
    .reduce((total, trip) => {
      return total + Number(trip.amount || 0);
    }, 0);

  const commission = trips.reduce((total, trip) => {
    return total + Number(trip.commission || 0);
  }, 0);

  const tip = trips.reduce((total, trip) => {
    return total + Number(trip.tip || 0);
  }, 0);

  const commissionByCompany = Object.values(
    trips.reduce((groups, trip) => {
      if (!trip.commissionCompanyName || Number(trip.commission || 0) <= 0) return groups;
      const name = trip.commissionCompanyName;
      groups[name] ||= { name, amount: 0, tripCount: 0 };
      groups[name].amount += Number(trip.commission);
      groups[name].tripCount += 1;
      return groups;
    }, {})
  ).map((group) => ({ ...group, amount: roundToTwoDecimals(group.amount) }));

  const displayedCash = importedSummary
    ? Number(importedSummary.cash || 0)
    : cash - commission - tip;
  const displayedCard = importedSummary
    ? Number(importedSummary.card || 0)
    : card;
  const totalRevenue = displayedCash + displayedCard;

  const realCash = displayedCash;

  const tripCount = trips.length;

  const cashTripCount = trips.filter(
    (trip) => trip.paymentType === "cash"
  ).length;

  const cardTripCount = trips.filter(
    (trip) => trip.paymentType === "card"
  ).length;

  const averageTrip =
    tripCount > 0 ? totalRevenue / tripCount : 0;

  const fuelOwn = Number(workDay.fuelOwn || 0);
  const fuelJose = Number(workDay.fuelJose || 0);

  const cashToDeliver =
    realCash - fuelOwn - fuelJose;

  const dailySettlement = buildDailySettlement({
    auth,
    dailySettlementSnapshot,
    endKm: workDay.endKm,
    fuelOwn,
    realCash,
    totalRevenue,
  });

  return {
    workDayId: workDay.id,
    date: workDay.date,
    startKm,
    endKm,
    workedKm: roundToTwoDecimals(workedKm),

    tripCount,
    cashTripCount,
    cardTripCount,

    cash: roundToTwoDecimals(
      importedSummary ? displayedCash : cash
    ),
    card: roundToTwoDecimals(displayedCard),
    totalRevenue: roundToTwoDecimals(totalRevenue),

    commission: roundToTwoDecimals(commission),
    commissionByCompany,
    tip: roundToTwoDecimals(tip),
    realCash: roundToTwoDecimals(realCash),

    fuelOwn: roundToTwoDecimals(fuelOwn),
    fuelJose: roundToTwoDecimals(fuelJose),

    cashToDeliver: roundToTwoDecimals(cashToDeliver),
    averageTrip: roundToTwoDecimals(averageTrip),
    dailySettlement,
  };
};

module.exports = {
  buildDailySettlement,
  getWorkDaySummaryService,
};
