const test = require("node:test");
const assert = require("node:assert/strict");

const {
  assertWorkDayCanBeDeleted,
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
