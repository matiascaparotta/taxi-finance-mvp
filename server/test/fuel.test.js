const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateFuelSplit,
  resolveFuelAllocation,
  validateFuelAmount,
} = require("../src/utils/fuel");

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

test("asigna toda la carga al conductor", () => {
  assert.deepEqual(calculateFuelSplit("41.50", "OWN"), {
    fuelOwn: 41.5,
    fuelJose: 0,
  });
});

test("reparte una carga con céntimos pares al 50 %", () => {
  assert.deepEqual(calculateFuelSplit("41.50", "SHARED"), {
    fuelOwn: 20.75,
    fuelJose: 20.75,
  });
});

test("asigna al conductor el céntimo indivisible", () => {
  assert.deepEqual(calculateFuelSplit("41.51", "SHARED"), {
    fuelOwn: 20.76,
    fuelJose: 20.75,
  });
});

test("reparte correctamente un importe de cero", () => {
  assert.deepEqual(calculateFuelSplit("0", "SHARED"), {
    fuelOwn: 0,
    fuelJose: 0,
  });
});

test("rechaza una opción de reparto desconocida o ausente", () => {
  for (const invalidAllocation of ["HALF", "", undefined]) {
    assert.throws(
      () => calculateFuelSplit("41.50", invalidAllocation),
      /Indica cómo corresponde/
    );
  }
});

test("un propietario registra toda la carga como gasolina propia", () => {
  assert.equal(
    resolveFuelAllocation("SHARED", { isOwner: true }),
    "OWN"
  );
  assert.deepEqual(
    calculateFuelSplit(
      "41.50",
      resolveFuelAllocation("SHARED", { isOwner: true })
    ),
    {
      fuelOwn: 41.5,
      fuelJose: 0,
    }
  );
});

test("un conductor conserva la opción de compartir combustible", () => {
  assert.equal(
    resolveFuelAllocation("SHARED", { isOwner: false }),
    "SHARED"
  );
});
