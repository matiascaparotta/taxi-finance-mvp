import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const page = fs.readFileSync(
  path.resolve(testDirectory, "../src/pages/MonthlySettlementPage.jsx"),
  "utf8"
);

test("la liquidación distingue facturación, reparto y cierre de caja", () => {
  assert.match(page, /Facturación neta para reparto/);
  assert.match(page, /Base a dividir/);
  assert.match(page, /CIERRE DE CAJA/);
  assert.match(page, /Gasolina de José/);
});

test("José revisa y Matías conserva el cierre definitivo", () => {
  assert.match(page, /José puede revisar los datos/);
  assert.match(page, /El cierre definitivo lo confirma Matías/);
  assert.match(page, /Escribe CERRAR/);
});

test("el resultado indica correctamente quién entrega el dinero", () => {
  assert.match(page, /Matías entrega a José/);
  assert.match(page, /José entrega a Matías/);
  assert.match(page, /Math\.abs\(calculation\.deliveryToOwner\)/);
});
