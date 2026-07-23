const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getAllowedCloseDates,
  validateCloseDate,
} = require("../src/utils/workDayDate");

const NOW = new Date(2026, 6, 24, 23, 30);

test("permite cerrar la jornada con la fecha de hoy", () => {
  assert.equal(validateCloseDate("2026-07-24", NOW), "2026-07-24");
});

test("permite cerrar la jornada con la fecha de ayer", () => {
  assert.equal(validateCloseDate("2026-07-23", NOW), "2026-07-23");
});

test("calcula ayer correctamente al cambiar de mes", () => {
  const firstDayOfMonth = new Date(2026, 7, 1, 1, 0);

  assert.deepEqual(getAllowedCloseDates(firstDayOfMonth), [
    "2026-08-01",
    "2026-07-31",
  ]);
});

test("rechaza una fecha distinta de hoy o ayer", () => {
  assert.throws(
    () => validateCloseDate("2026-07-22", NOW),
    /solo puede ser hoy o ayer/
  );
});

test("rechaza una fecha ausente o con formato incorrecto", () => {
  assert.throws(
    () => validateCloseDate(undefined, NOW),
    /Confirma si la jornada corresponde a hoy o ayer/
  );
  assert.throws(
    () => validateCloseDate("24/07/2026", NOW),
    /Confirma si la jornada corresponde a hoy o ayer/
  );
});
