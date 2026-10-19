const assert = require("node:assert/strict");
const test = require("node:test");

const {
  calculateDailySettlement,
} = require("../src/utils/dailySettlement");

test("reproduce el cierre diario de referencia del 1 de octubre", () => {
  const result = calculateDailySettlement({
    netRevenue: 283.03,
    cashRetained: 105.3,
    fuelCost: 29.01,
    socialSecurity: 35,
  });

  assert.equal(result.distributableBase, 219.02);
  assert.equal(result.driverShare, 109.51);
  assert.equal(result.ownerShare, 109.51);
  assert.equal(result.reimbursableFuel, 29.01);
  assert.equal(result.driverEntitlement, 138.52);
  assert.equal(result.balance, 33.22);
  assert.equal(result.balanceDirection, "OWNER_PAYS_DRIVER");
});

test("deja el céntimo de diferencia en la parte del jefe", () => {
  const result = calculateDailySettlement({
    netRevenue: 100.01,
    cashRetained: 0,
    fuelCost: 0,
    socialSecurity: 0,
  });

  assert.equal(result.driverShare, 50);
  assert.equal(result.ownerShare, 50.01);
  assert.equal(result.distributableBase, 100.01);
});

test("reproduce el cierre real del 2 de octubre y deja el céntimo al jefe", () => {
  const result = calculateDailySettlement({
    netRevenue: 619.41,
    cashRetained: 6.13,
    fuelCost: 74,
    socialSecurity: 35,
  });

  assert.equal(result.distributableBase, 510.41);
  assert.equal(result.driverShare, 255.2);
  assert.equal(result.ownerShare, 255.21);
  assert.equal(result.driverEntitlement, 329.2);
  assert.equal(result.balance, 323.07);
  assert.equal(result.balanceDirection, "OWNER_PAYS_DRIVER");
});

test("mantiene una base negativa y expresa correctamente la deuda", () => {
  const result = calculateDailySettlement({
    netRevenue: 20,
    cashRetained: 20,
    fuelCost: 10,
    socialSecurity: 35,
  });

  assert.equal(result.distributableBase, -25);
  assert.equal(result.driverShare, -12.5);
  assert.equal(result.ownerShare, -12.5);
  assert.equal(result.balance, -22.5);
  assert.equal(result.balanceDirection, "DRIVER_PAYS_OWNER");
});

test("indica cuánto debe entregar el conductor cuando conservó efectivo de más", () => {
  const result = calculateDailySettlement({
    netRevenue: 200,
    cashRetained: 120,
    fuelCost: 30,
    socialSecurity: 35,
  });

  assert.equal(result.driverShare, 67.5);
  assert.equal(result.reimbursableFuel, 30);
  assert.equal(result.balance, -22.5);
  assert.equal(result.balanceDirection, "DRIVER_PAYS_OWNER");
});

test("informa que la liquidación quedó saldada cuando no hay diferencia", () => {
  const result = calculateDailySettlement({
    netRevenue: 200,
    cashRetained: 97.5,
    fuelCost: 30,
    socialSecurity: 35,
  });

  assert.equal(result.balance, 0);
  assert.equal(result.balanceDirection, "SETTLED");
});

test("rechaza importes y porcentajes inválidos", () => {
  assert.throws(
    () =>
      calculateDailySettlement({
        netRevenue: -1,
        cashRetained: 0,
        fuelCost: 0,
        socialSecurity: 0,
      }),
    /recaudación neta/
  );
  assert.throws(
    () =>
      calculateDailySettlement({
        netRevenue: 1,
        cashRetained: 0,
        fuelCost: 0,
        socialSecurity: 0,
        driverShareBasisPoints: 10001,
      }),
    /porcentaje/
  );
});
