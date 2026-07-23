import test from "node:test";
import assert from "node:assert/strict";

import { buildWorkDaySummaryText } from "../src/utils/buildWorkDaySummaryText.js";

const workDay = {
  date: "2026-07-24",
  startKm: 70000,
  endKm: 70186,
};

test("genera el resumen breve con efectivo final y combustible compartido", () => {
  const summary = {
    workedKm: 186,
    cash: 152.7,
    realCash: 145.2,
    card: 312.4,
    totalRevenue: 457.6,
    fuelOwn: 20.76,
    fuelJose: 20.75,
  };

  assert.equal(
    buildWorkDaySummaryText(workDay, summary),
    `VIERNES 24/07

KM: 186

EFECTIVO: 145,20 €
DATÁFONO: 312,40 €
FACTURACIÓN: 457,60 €

GASOLINA: 20,76 €
GASOLINA JOSÉ: 20,75 €`
  );
});

test("omite ambos combustibles cuando son cero", () => {
  const summary = {
    workedKm: 186,
    cash: 145.2,
    realCash: 145.2,
    card: 312.4,
    totalRevenue: 457.6,
    fuelOwn: 0,
    fuelJose: 0,
  };

  const text = buildWorkDaySummaryText(workDay, summary);

  assert.equal(text.includes("GASOLINA"), false);
  assert.equal(text.endsWith("FACTURACIÓN: 457,60 €"), true);
});

test("omite Gasolina José cuando la carga pertenece al conductor", () => {
  const summary = {
    workedKm: 186,
    realCash: 145.2,
    card: 312.4,
    totalRevenue: 457.6,
    fuelOwn: 41.5,
    fuelJose: 0,
  };

  const text = buildWorkDaySummaryText(workDay, summary);

  assert.equal(text.includes("GASOLINA: 41,50 €"), true);
  assert.equal(text.includes("GASOLINA JOSÉ"), false);
});

test("no muestra nombres ni totales financieros prohibidos", () => {
  const summary = {
    workedKm: 186,
    realCash: 145.2,
    card: 312.4,
    totalRevenue: 457.6,
    fuelOwn: 0,
    fuelJose: 0,
  };

  const text = buildWorkDaySummaryText(workDay, summary);

  for (const forbiddenText of [
    "EFECTIVO REAL",
    "EFECTIVO BRUTO",
    "COMISIONES",
    "PROPINAS",
  ]) {
    assert.equal(text.includes(forbiddenText), false);
  }
});
