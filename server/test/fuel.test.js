const test = require("node:test");
const assert = require("node:assert/strict");

const { validateFuelAmount } = require("../src/utils/fuel");

test("permite registrar una jornada sin carga de combustible", () => {
  assert.equal(validateFuelAmount("0"), 0);
});

test("acepta importes enteros y con hasta dos decimales", () => {
  assert.equal(validateFuelAmount("40"), 40);
  assert.equal(validateFuelAmount("40.5"), 40.5);
  assert.equal(validateFuelAmount("40.50"), 40.5);
});

test("acepta importes numéricos enviados directamente", () => {
  assert.equal(validateFuelAmount(40.5), 40.5);
});

test("rechaza valores vacíos, negativos o no numéricos", () => {
  for (const invalidAmount of ["", "-1", "gasolina", null, undefined]) {
    assert.throws(
      () => validateFuelAmount(invalidAmount),
      /importe de combustible válido/
    );
  }
});

test("rechaza importes con más de dos decimales", () => {
  assert.throws(
    () => validateFuelAmount("40.555"),
    /hasta 2 decimales/
  );
});
