const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildDailySettlement,
  calculatePaymentTotals,
} = require("../src/services/workDaySummaryService");

const albertoAuth = {
  accessMode: "user",
  settlementMode: "DAILY_50_50",
  driverShareBasisPoints: 5000,
  dailySocialSecurity: 35,
};

test("descuenta cada comisión del medio de pago utilizado", () => {
  const result = calculatePaymentTotals([
    { amount: 28, paymentType: "cash", commission: 5, tip: 0 },
    { amount: 40, paymentType: "card", commission: 4, tip: 0 },
  ], true);

  assert.equal(result.cashRevenue, 23);
  assert.equal(result.cardRevenue, 36);
  assert.equal(result.cashRetained, 28);
  assert.equal(result.cashCommission, 5);
  assert.equal(result.cardCommission, 4);
});

test("la comisión en efectivo sale de facturación pero permanece en la entrega", () => {
  const totals = calculatePaymentTotals([
    { amount: 28, paymentType: "cash", commission: 5, tip: 0 },
  ], true);
  const result = buildDailySettlement({
    auth: { ...albertoAuth, dailySocialSecurity: 0 },
    endKm: 70100,
    fuelOwn: 0,
    realCash: totals.cashRetained,
    totalRevenue: totals.cashRevenue + totals.cardRevenue,
  });

  assert.equal(result.netRevenue, 23);
  assert.equal(result.driverShare, 11.5);
  assert.equal(result.cashRetained, 28);
  assert.equal(result.balance, -16.5);
  assert.equal(result.balanceDirection, "DRIVER_PAYS_OWNER");
});

test("conecta el cierre diario configurado con el motor económico", () => {
  const result = buildDailySettlement({
    auth: albertoAuth,
    endKm: 70100,
    fuelOwn: 29.01,
    realCash: 105.3,
    totalRevenue: 283.03,
  });

  assert.equal(result.distributableBase, 219.02);
  assert.equal(result.driverShare, 109.51);
  assert.equal(result.reimbursableFuel, 29.01);
  assert.equal(result.balance, 33.22);
  assert.equal(result.balanceDirection, "OWNER_PAYS_DRIVER");
});

test("no calcula una liquidación definitiva para una jornada abierta", () => {
  const result = buildDailySettlement({
    auth: albertoAuth,
    endKm: null,
    fuelOwn: 29.01,
    realCash: 105.3,
    totalRevenue: 283.03,
  });

  assert.equal(result, null);
});

test("no altera los resúmenes con liquidación mensual o sin perfil", () => {
  const summary = {
    endKm: 70100,
    fuelOwn: 29.01,
    realCash: 105.3,
    totalRevenue: 283.03,
  };

  assert.equal(
    buildDailySettlement({
      ...summary,
      auth: {
        ...albertoAuth,
        settlementMode: "MONTHLY_50_50",
      },
    }),
    null
  );
  assert.equal(buildDailySettlement({ ...summary, auth: null }), null);
});

test("prioriza la instantánea cerrada aunque cambie la configuración", () => {
  const result = buildDailySettlement({
    workDayId: 170,
    auth: {
      ...albertoAuth,
      dailySocialSecurity: 99,
      driverShareBasisPoints: 4000,
    },
    dailySettlementSnapshot: {
      netRevenue: "283.03",
      cashRetained: "105.30",
      fuelCost: "29.01",
      socialSecurity: "35.00",
      driverShareBasisPoints: 5000,
      distributableBase: "219.02",
      driverShare: "109.51",
      ownerShare: "109.51",
      reimbursableFuel: "29.01",
      driverEntitlement: "138.52",
      balance: "33.22",
      balanceDirection: "OWNER_PAYS_DRIVER",
      pendingBalance: "23.22",
    },
    dailySettlementPayments: [
      {
        id: 9,
        direction: "OWNER_TO_DRIVER",
        amount: "10.00",
        createdAt: "2026-10-13 10:30:00",
      },
    ],
    endKm: 70100,
    fuelOwn: 29.01,
    realCash: 105.3,
    totalRevenue: 283.03,
  });

  assert.equal(result.socialSecurity, 35);
  assert.equal(result.driverSharePercentage, 50);
  assert.equal(result.balance, 33.22);
  assert.equal(result.pendingBalance, 23.22);
  assert.equal(result.payments.length, 1);
  assert.equal(result.payments[0].amount, 10);
});

test("un ajuste en efectivo posterior al cierre cambia el resultado de ese día", () => {
  const result = buildDailySettlement({
    auth: albertoAuth,
    workDayId: 183,
    dailySettlementSnapshot: {
      netRevenue: "350.95",
      cashRetained: "75.83",
      fuelCost: "38.01",
      socialSecurity: "35.00",
      driverShareBasisPoints: 5000,
      distributableBase: "277.94",
      driverShare: "138.97",
      ownerShare: "138.97",
      reimbursableFuel: "38.01",
      driverEntitlement: "176.98",
      ownerAdjustment: "0.00",
      balance: "101.15",
      balanceDirection: "OWNER_PAYS_DRIVER",
      pendingBalance: "96.15",
    },
    dailySettlementAdjustments: [
      { id: 1, workDayId: 183, direction: "DRIVER_TO_OWNER", amount: "5.00", reason: "Mati · Aviación General" },
      { id: 2, workDayId: 182, direction: "DRIVER_TO_OWNER", amount: "7.00", reason: "Otro día" },
    ],
    endKm: 520765,
    fuelOwn: 38.01,
    realCash: 75.83,
    totalRevenue: 350.95,
  });

  assert.equal(result.originalBalance, 101.15);
  assert.equal(result.postCloseAdjustment, -5);
  assert.equal(result.balance, 96.15);
  assert.equal(result.balanceDirection, "OWNER_PAYS_DRIVER");
  assert.equal(result.adjustments.length, 1);
});

test("explica el acumulado antes y después del ajuste de la jornada", () => {
  const result = buildDailySettlement({
    auth: albertoAuth,
    workDayId: 171,
    workDayDate: "2026-10-03",
    dailySettlementSnapshot: {
      netRevenue: "421.64",
      cashRetained: "116.05",
      fuelCost: "35.00",
      socialSecurity: "35.00",
      driverShareBasisPoints: 5000,
      distributableBase: "351.64",
      driverShare: "175.82",
      ownerShare: "175.82",
      reimbursableFuel: "35.00",
      driverEntitlement: "210.82",
      balance: "94.77",
      balanceDirection: "OWNER_PAYS_DRIVER",
      pendingBalance: "446.06",
    },
    dailySettlementAdjustments: [
      { id: 1, workDayId: 171, direction: "DRIVER_TO_OWNER", amount: "5.00", reason: "Mati · Aviación General" },
    ],
  });

  assert.equal(result.previousPendingBalance, 356.29);
  assert.equal(result.originalBalance, 94.77);
  assert.equal(result.pendingBeforeAdjustments, 451.06);
  assert.equal(result.postCloseAdjustment, -5);
  assert.equal(result.pendingBalance, 446.06);
});
