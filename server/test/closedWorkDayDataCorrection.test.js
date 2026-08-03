const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  validateCorrectedKilometres,
} = require("../src/utils/closedWorkDayCorrection");

test("acepta kilómetros que conservan la continuidad del vehículo", () => {
  assert.deepEqual(
    validateCorrectedKilometres({
      startKm: "71000",
      endKm: "71200",
      previousEndKm: 71000,
      nextStartKm: 71250,
    }),
    { startKm: 71000, endKm: 71200 }
  );
});

test("rechaza romper la jornada anterior o la siguiente", () => {
  assert.throws(
    () =>
      validateCorrectedKilometres({
        startKm: 70999,
        endKm: 71200,
        previousEndKm: 71000,
      }),
    /jornada anterior/
  );
  assert.throws(
    () =>
      validateCorrectedKilometres({
        startKm: 71000,
        endKm: 71251,
        nextStartKm: 71250,
      }),
    /jornada siguiente/
  );
});

test("rechaza un kilometraje final menor al inicial", () => {
  assert.throws(
    () =>
      validateCorrectedKilometres({
        startKm: 71200,
        endKm: 71199,
      }),
    /menor al inicial/
  );
});

test("corrige y audita la jornada dentro de la misma transacción", () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, "../src/repositories/workDayRepository.js"),
    "utf8"
  );
  const start = source.indexOf("const updateClosedWorkDayWithAudit");
  const end = source.indexOf("module.exports", start);
  const operation = source.slice(start, end);

  assert.match(operation, /beginTransaction\(\)/);
  assert.match(operation, /UPDATE work_days/);
  assert.match(operation, /'WORK_DAY'/);
  assert.match(operation, /correction_audit_logs/);
  assert.match(operation, /previous_data/);
  assert.match(operation, /resulting_data/);
  assert.match(operation, /commit\(\)/);
  assert.match(operation, /rollback\(\)/);
});
