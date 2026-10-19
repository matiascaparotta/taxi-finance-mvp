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

const parseAdjustmentBreakdown = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const calculatePaymentTotals = (trips, usesPaymentScopedCommission = false) => {
  const grossCash = trips
    .filter((trip) => trip.paymentType === "cash")
    .reduce((total, trip) => total + Number(trip.amount || 0), 0);
  const grossCard = trips
    .filter((trip) => trip.paymentType === "card")
    .reduce((total, trip) => total + Number(trip.amount || 0), 0);
  const cashCommission = trips
    .filter((trip) => trip.paymentType === "cash")
    .reduce((total, trip) => total + Number(trip.commission || 0), 0);
  const cardCommission = trips
    .filter((trip) => trip.paymentType === "card")
    .reduce((total, trip) => total + Number(trip.commission || 0), 0);
  const commission = cashCommission + cardCommission;
  const tip = trips.reduce((total, trip) => total + Number(trip.tip || 0), 0);

  return {
    grossCash,
    grossCard,
    cashCommission,
    cardCommission,
    commission,
    tip,
    cashRevenue: grossCash - (usesPaymentScopedCommission ? cashCommission : commission) - tip,
    cardRevenue: grossCard - (usesPaymentScopedCommission ? cardCommission : 0),
    // Una comisión cobrada en efectivo deja de ser facturación, pero el
    // conductor sí conserva físicamente ese dinero hasta la liquidación.
    cashRetained: usesPaymentScopedCommission
      ? grossCash - tip
      : grossCash - commission - tip,
  };
};

const buildDailySettlement = ({
  auth,
  workDayId,
  workDayDate,
  dailySettlementSnapshot,
  dailySettlementPayments = [],
  dailySettlementAdjustments = [],
  endKm,
  fuelOwn,
  realCash,
  totalRevenue,
}) => {
  if (dailySettlementSnapshot) {
    const currentDayAdjustments = dailySettlementAdjustments.filter(
      (adjustment) => Number(adjustment.workDayId) === Number(workDayId)
    );
    const postCloseAdjustment = roundToTwoDecimals(
      currentDayAdjustments.reduce(
        (total, adjustment) => total + (
          adjustment.direction === "OWNER_TO_DRIVER"
            ? Number(adjustment.amount || 0)
            : -Number(adjustment.amount || 0)
        ),
        0
      )
    );
    const originalBalance = Number(dailySettlementSnapshot.balance);
    const balance = roundToTwoDecimals(originalBalance + postCloseAdjustment);
    const normalizedWorkDayDate = String(workDayDate || "").slice(0, 10);
    const currentDayPaymentEffect = roundToTwoDecimals(
      dailySettlementPayments
        .filter((payment) => normalizedWorkDayDate && String(payment.paymentDate || "").slice(0, 10) === normalizedWorkDayDate)
        .reduce(
          (total, payment) => total + (
            payment.direction === "OWNER_TO_DRIVER"
              ? -Number(payment.amount || 0)
              : Number(payment.amount || 0)
          ),
          0
        )
    );
    const pendingBalance = Number(dailySettlementSnapshot.pendingBalance);
    const pendingBeforeAdjustments = roundToTwoDecimals(
      pendingBalance - postCloseAdjustment
    );
    const previousPendingBalance = roundToTwoDecimals(
      pendingBeforeAdjustments - originalBalance - currentDayPaymentEffect
    );

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
      ownerAdjustment: Number(dailySettlementSnapshot.ownerAdjustment || 0),
      ownerAdjustmentBreakdown: parseAdjustmentBreakdown(
        dailySettlementSnapshot.ownerAdjustmentBreakdown
      ).map((item) => ({
        company: String(item.company || "Ajuste externo"),
        amount: Number(item.amount || 0),
        paymentType: item.paymentType || null,
      })),
      originalBalance,
      postCloseAdjustment,
      previousPendingBalance,
      currentDayPaymentEffect,
      pendingBeforeAdjustments,
      balance,
      balanceDirection:
        balance > 0
          ? "OWNER_PAYS_DRIVER"
          : balance < 0
            ? "DRIVER_PAYS_OWNER"
            : "SETTLED",
      pendingBalance,
      payments: dailySettlementPayments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
      })),
      adjustments: currentDayAdjustments.map((adjustment) => ({
        ...adjustment,
        amount: Number(adjustment.amount),
      })),
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
    dailySettlementPayments,
    dailySettlementAdjustments,
  } = result;

  const startKm = Number(workDay.startKm || 0);
  const endKm = Number(workDay.endKm || 0);

  const workedKm = endKm - startKm;

  const usesPaymentScopedCommission =
    Boolean(dailySettlementSnapshot) ||
    auth?.settlementMode === "DAILY_50_50";
  const paymentTotals = calculatePaymentTotals(
    trips,
    usesPaymentScopedCommission
  );
  const cash = paymentTotals.grossCash;
  const card = paymentTotals.grossCard;
  const commission = paymentTotals.commission;
  const cashCommission = paymentTotals.cashCommission;
  const cardCommission = paymentTotals.cardCommission;
  const tip = paymentTotals.tip;

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
    : paymentTotals.cashRevenue;
  const displayedCard = importedSummary
    ? Number(importedSummary.card || 0)
    : paymentTotals.cardRevenue;
  const totalRevenue = displayedCash + displayedCard;

  const realCash = usesPaymentScopedCommission && !importedSummary
    ? paymentTotals.cashRetained
    : displayedCash;

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
    workDayId: workDay.id,
    workDayDate: workDay.date,
    dailySettlementSnapshot,
    dailySettlementPayments,
    dailySettlementAdjustments,
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
    cashRevenue: roundToTwoDecimals(displayedCash),
    card: roundToTwoDecimals(displayedCard),
    totalRevenue: roundToTwoDecimals(totalRevenue),

    commission: roundToTwoDecimals(commission),
    cashCommission: roundToTwoDecimals(cashCommission),
    cardCommission: roundToTwoDecimals(cardCommission),
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
  calculatePaymentTotals,
  getWorkDaySummaryService,
};
