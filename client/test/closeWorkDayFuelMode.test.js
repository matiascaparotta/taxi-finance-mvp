import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync(
  new URL("../src/pages/CloseWorkDayPage.jsx", import.meta.url),
  "utf8"
);

test("Alberto elige en cada cierre entre ticket y cálculo por kilómetros", () => {
  assert.match(page, /Importe del ticket/);
  assert.match(page, /Por kilómetros/);
  assert.match(page, /fuelCalculationMode/);
  assert.match(page, /selectedFuelMode/);
});
