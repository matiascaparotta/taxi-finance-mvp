const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  registerDailySettlementAdjustment,
} = require("../src/services/dailySettlementAdjustmentService");
const { BACKUP_TABLES } = require("../src/scripts/backupDatabase");

const auth = {
  accessMode: "user",
  organizationId: 2,
  userId: 3,
  settlementMode: "DAILY_50_50",
};

test("registra un ajuste motivado con dirección explícita", async () => {
  let received;
  await registerDailySettlementAdjustment({
    workDayId: 162,
    direction: "DRIVER_TO_OWNER",
    amount: "5,00",
    reason: "Comisión WellMati",
    idempotencyKey: "adjustment_test_123",
  }, auth, async (data) => {
    received = data;
    return data;
  });

  assert.equal(received.amount, 5);
  assert.equal(received.reason, "Comisión WellMati");
  assert.equal(received.direction, "DRIVER_TO_OWNER");
  assert.equal(received.workDayId, 162);
});

test("rechaza un ajuste sin motivo o dirección", async () => {
  await assert.rejects(
    registerDailySettlementAdjustment({
      workDayId: 162,
      amount: "5",
      reason: "",
      idempotencyKey: "adjustment_test_124",
    }, auth, async () => assert.fail("No debe escribir")),
    /dirección|Indica quién|motivo/
  );
});

test("la migración protege el historial de ajustes y el respaldo lo incluye", () => {
  const migration = fs.readFileSync(path.resolve(
    __dirname,
    "../database/migrations/028_create_daily_settlement_adjustments.sql"
  ), "utf8");
  assert.match(migration, /UNIQUE KEY uq_daily_adjustment_idempotency/);
  assert.match(migration, /reason VARCHAR\(160\)/);
  assert.equal(BACKUP_TABLES.includes("daily_settlement_adjustments"), true);
});
