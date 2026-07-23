const test = require("node:test");
const assert = require("node:assert/strict");

const { validateStartKm } = require("../src/utils/odometer");

test("permite iniciar con el mismo kilometraje final anterior", () => {
  assert.equal(validateStartKm("71000", 71000), 71000);
});

test("permite iniciar con un kilometraje superior", () => {
  assert.equal(validateStartKm("71025", 71000), 71025);
});

test("rechaza un kilometraje inferior sin confirmación", () => {
  assert.throws(
    () => validateStartKm("12000", 71000),
    /no puede ser inferior a 71000 km/
  );
});

test("permite establecer una nueva base con confirmación explícita", () => {
  assert.equal(validateStartKm("12000", 71000, true), 12000);
});

test("no exige referencia cuando todavía no hay jornadas cerradas", () => {
  assert.equal(validateStartKm("12000", null), 12000);
});

test("rechaza kilometrajes vacíos, negativos o no numéricos", () => {
  for (const invalidKm of ["", "-1", "kilómetros", null, undefined]) {
    assert.throws(
      () => validateStartKm(invalidKm, 71000),
      /kilometraje inicial/
    );
  }
});
