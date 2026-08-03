import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const page = fs.readFileSync(path.resolve(testDirectory, "../src/pages/MonthlySettlementPage.jsx"), "utf8");
const component = fs.readFileSync(path.resolve(testDirectory, "../src/components/MonthlySettlementShareButton.jsx"), "utf8");
const generator = fs.readFileSync(path.resolve(testDirectory, "../src/utils/createMonthlySettlementShareCard.js"), "utf8");

test("solo ofrece compartir una liquidación cerrada", () => {
  assert.match(page, /settlement\.status === "CLOSED"/);
  assert.match(page, /MonthlySettlementShareButton/);
});

test("la tarjeta contiene el cierre esencial de Matías y José", () => {
  assert.match(generator, /LIQUIDACIÓN MENSUAL/);
  assert.match(generator, /CIERRE DE CAJA/);
  assert.match(generator, /FACTURACIÓN TOTAL/);
  assert.match(generator, /Ganancia neta Matías/);
  assert.match(generator, /Ganancia neta José/);
  assert.match(generator, /Nómina transferida/);
  assert.match(generator, /Gasolina de José/);
  assert.match(generator, /Efectivo disponible/);
  assert.match(generator, /deliveryToOwner/);
});

test("comparte la imagen y conserva una descarga alternativa", () => {
  assert.match(component, /navigator\.share/);
  assert.match(component, /navigator\.canShare/);
  assert.match(component, /link\.download/);
});
