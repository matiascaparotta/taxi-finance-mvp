const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  assertActiveWorkDayCanBeCancelled,
  getCancellationActor,
  validateCancellationConfirmation,
} = require("../src/services/activeWorkDayCancellation");

test("solo permite cancelar una jornada activa propia", () => {
  assert.doesNotThrow(() =>
    assertActiveWorkDayCanBeCancelled({ status: "OPEN", isLocked: false })
  );
  assert.throws(
    () => assertActiveWorkDayCanBeCancelled({ status: "CLOSED" }),
    /jornada activa/
  );
  assert.throws(
    () => assertActiveWorkDayCanBeCancelled(null),
    /Jornada no encontrada/
  );
});

test("exige cuenta personal y confirmación CANCELAR", () => {
  assert.equal(validateCancellationConfirmation(" cancelar "), "CANCELAR");
  assert.throws(
    () => validateCancellationConfirmation("eliminar"),
    /Escribe CANCELAR/
  );
  assert.deepEqual(
    getCancellationActor({
      accessMode: "user",
      userId: 2,
      organizationId: 1,
    }),
    { actorUserId: 2, organizationId: 1 }
  );
  assert.throws(
    () => getCancellationActor({ accessMode: "legacy" }),
    /cuenta personal/
  );
});

test("cancela y audita sin borrar la jornada ni sus viajes", () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, "../src/repositories/workDayRepository.js"),
    "utf8"
  );
  const start = source.indexOf("const cancelOpenWorkDayWithAudit");
  const end = source.indexOf("const deleteWorkDayById", start);
  const operation = source.slice(start, end);

  assert.match(operation, /beginTransaction\(\)/);
  assert.match(operation, /FOR UPDATE/);
  assert.match(operation, /status = 'CANCELLED'/);
  assert.match(operation, /'CANCEL'/);
  assert.match(operation, /correction_audit_logs/);
  assert.doesNotMatch(operation, /DELETE FROM/);
  assert.match(operation, /commit\(\)/);
  assert.match(operation, /rollback\(\)/);
});

test("la migración permite reemplazar una jornada cancelada", () => {
  const migration = fs.readFileSync(
    path.resolve(
      __dirname,
      "../database/migrations/015_cancel_active_work_days.sql"
    ),
    "utf8"
  );

  assert.match(migration, /'CANCELLED'/);
  assert.match(migration, /GENERATED ALWAYS/);
  assert.match(migration, /WHEN status IN \('OPEN', 'CLOSED'\)/);
  assert.match(migration, /UNIQUE \(driver_user_id, active_date\)/);
});
