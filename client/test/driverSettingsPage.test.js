import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync(new URL("../src/pages/DriverSettingsPage.jsx", import.meta.url), "utf8");
test("Alberto configura combustible, seguridad social y empresas", () => {
  assert.match(page, /Combustible por kilómetro/);
  assert.match(page, /Seguridad Social diaria/);
  assert.match(page, /Empresas y hoteles/);
  assert.match(page, /Retirar/);
  assert.match(page, /Reactivar/);
  assert.match(page, /Empresa actualizada/);
});
