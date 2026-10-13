const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  registerDailySettlementPayment,
} = require("../src/services/dailySettlementPaymentService");
const {
  BACKUP_TABLES,
} = require("../src/scripts/backupDatabase");
const {
  getPaymentDirection,
  validatePaymentAgainstBalance,
} = require("../src/utils/dailySettlementPayment");

const auth = {
  accessMode: "user",
  organizationId: 2,
  userId: 3,
  settlementMode: "DAILY_50_50",
};

test("registra un pago válido dentro del perfil diario", async () => {
  let received;
  const result = await registerDailySettlementPayment(
    { amount: "23,22", idempotencyKey: "payment_test_123" },
    auth,
    async (data) => {
      received = data;
      return { pendingBalance: 0 };
    }
  );

  assert.equal(received.amount, 23.22);
  assert.equal(received.organizationId, 2);
  assert.equal(received.driverUserId, 3);
  assert.equal(result.pendingBalance, 0);
});

test("rechaza importes inválidos antes de escribir", async () => {
  await assert.rejects(
    registerDailySettlementPayment(
      { amount: "10,999", idempotencyKey: "payment_test_124" },
      auth,
      async () => assert.fail("No debe escribir")
    ),
    /importe válido/
  );
});

test("limita el registro al perfil de liquidación diaria", async () => {
  await assert.rejects(
    registerDailySettlementPayment(
      { amount: "10", idempotencyKey: "payment_test_125" },
      { ...auth, settlementMode: "MONTHLY_50_50" },
      async () => assert.fail("No debe escribir")
    ),
    /no utiliza liquidación diaria/
  );
});

test("la migración protege duplicados y conserva el historial", () => {
  const migration = fs.readFileSync(
    path.resolve(
      __dirname,
      "../database/migrations/026_create_daily_settlement_payments.sql"
    ),
    "utf8"
  );

  assert.match(migration, /UNIQUE KEY uq_daily_payment_idempotency/);
  assert.match(migration, /OWNER_TO_DRIVER/);
  assert.match(migration, /DRIVER_TO_OWNER/);
  assert.equal(BACKUP_TABLES.includes("daily_settlement_payments"), true);
});

test("deduce quién paga sin permitir superar el pendiente", () => {
  assert.equal(getPaymentDirection(23.22), "OWNER_TO_DRIVER");
  assert.equal(getPaymentDirection(-10), "DRIVER_TO_OWNER");
  assert.doesNotThrow(() => validatePaymentAgainstBalance(5, 10));
  assert.throws(
    () => validatePaymentAgainstBalance(10.01, -10),
    /no puede superar/
  );
  assert.throws(() => getPaymentDirection(0), /No hay saldo pendiente/);
});
