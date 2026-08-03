const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateMonthlySettlement,
} = require("../src/utils/monthlySettlement");

test("reproduce exactamente la liquidación validada de junio", () => {
  const result = calculateMonthlySettlement({
    summaries: [
      {
        totalRevenue: 5552.56,
        realCash: 2373.29,
        card: 3179.27,
        fuelOwn: 364.48,
        fuelJose: 110.73,
        workedKm: 4890,
        tripCount: 200,
      },
    ],
    socialSecurity: 670,
    payrollTransfer: 1533.41,
    expectedWorkDays: 22,
  });

  assert.equal(result.netRevenueForSplit, 5188.08);
  assert.equal(result.distributableBase, 4518.08);
  assert.equal(result.driverHalf, 2259.04);
  assert.equal(result.pendingForDriver, 725.63);
  assert.equal(result.cashAvailable, 1898.08);
  assert.equal(result.deliveryToOwner, 1172.45);
});

test("reconstruye junio desde las jornadas oficiales de TaxFin", () => {
  const result = calculateMonthlySettlement({
    summaries: [
      {
        totalRevenue: 5552.77,
        realCash: 2373.5,
        card: 3179.27,
        fuelOwn: 364.48,
        fuelJose: 110.73,
        workedKm: 5122,
      },
    ],
    socialSecurity: 670,
    payrollTransfer: 1533.41,
    expectedWorkDays: 22,
  });

  assert.equal(result.netRevenueForSplit, 5188.29);
  assert.equal(result.distributableBase, 4518.29);
  assert.equal(result.driverHalf, 2259.14);
  assert.equal(result.pendingForDriver, 725.73);
  assert.equal(result.cashAvailable, 1898.29);
  assert.equal(result.deliveryToOwner, 1172.56);
  assert.equal(result.workedKm, 5122);
});

test("prorratea la seguridad social solo durante el mes en curso", () => {
  const result = calculateMonthlySettlement({
    summaries: Array.from({ length: 11 }, () => ({ totalRevenue: 100 })),
    socialSecurity: 670,
    expectedWorkDays: 22,
    payrollTransfer: 0,
    useProratedSocialSecurity: true,
  });

  assert.equal(result.dailySocialSecurity, 30.45);
  assert.equal(result.socialSecurityApplied, 335);
  assert.equal(result.distributableBase, 765);
  assert.equal(result.averageDailyRevenue, 69.55);
});

test("calcula el promedio diario después de gasolina y seguridad social", () => {
  const result = calculateMonthlySettlement({
    summaries: [
      { totalRevenue: 300, fuelOwn: 30 },
      { totalRevenue: 200, fuelOwn: 20 },
    ],
    socialSecurity: 100,
    expectedWorkDays: 2,
    payrollTransfer: 0,
  });

  assert.equal(result.distributableBase, 350);
  assert.equal(result.averageDailyRevenue, 175);
});

test("descuenta por separado la gasolina propia y la de José de caja", () => {
  const result = calculateMonthlySettlement({
    summaries: [
      { totalRevenue: 1000, realCash: 800, fuelOwn: 100, fuelJose: 50 },
    ],
    socialSecurity: 0,
    payrollTransfer: 0,
  });

  assert.equal(result.netRevenueForSplit, 900);
  assert.equal(result.driverHalf, 450);
  assert.equal(result.cashAvailable, 650);
  assert.equal(result.deliveryToOwner, 200);
});
