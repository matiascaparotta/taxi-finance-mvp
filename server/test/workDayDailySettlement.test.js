const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildDailySettlement,
} = require("../src/services/workDaySummaryService");

const albertoAuth = {
  accessMode: "user",
  settlementMode: "DAILY_50_50",
  driverShareBasisPoints: 5000,
  dailySocialSecurity: 35,
};

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
