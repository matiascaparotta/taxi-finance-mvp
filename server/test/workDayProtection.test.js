const test = require("node:test");
const assert = require("node:assert/strict");

const {
  assertWorkDayCanBeDeleted,
  validateWorkDayDeletionConfirmation,
} = require("../src/services/workDayProtection");

test("permite eliminar una jornada nueva", () => {
  assert.doesNotThrow(() =>
    assertWorkDayCanBeDeleted({ id: 71, isLocked: false })
  );
});

test("protege una jornada histórica importada", () => {
  assert.throws(
    () => assertWorkDayCanBeDeleted({ id: 1, isLocked: true }),
    /jornadas históricas importadas están protegidas/
  );
});

test("rechaza eliminar una jornada inexistente", () => {
  assert.throws(
    () => assertWorkDayCanBeDeleted(null),
    /Jornada no encontrada/
  );
});

test("exige escribir ELIMINAR para borrar una jornada completa", () => {
  assert.equal(
    validateWorkDayDeletionConfirmation(" eliminar "),
    "ELIMINAR"
  );
  assert.throws(
    () => validateWorkDayDeletionConfirmation("confirmar"),
    /Escribe ELIMINAR/
  );
  assert.throws(
    () => validateWorkDayDeletionConfirmation(undefined),
    /pantalla está desactualizada/
  );
});
