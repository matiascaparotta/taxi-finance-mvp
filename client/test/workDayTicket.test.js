import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const ticket = fs.readFileSync(
  path.resolve(testDirectory, "../src/components/WorkDayTicket.jsx"),
  "utf8"
);
const activeTrip = fs.readFileSync(
  path.resolve(testDirectory, "../src/components/ActiveTripCard.jsx"),
  "utf8"
);
const liveDetail = fs.readFileSync(
  path.resolve(testDirectory, "../src/pages/WorkDayDetailPage.jsx"),
  "utf8"
);
const sharedCard = fs.readFileSync(
  path.resolve(testDirectory, "../src/utils/createWorkDayShareCard.js"),
  "utf8"
);
const sharedText = fs.readFileSync(
  path.resolve(testDirectory, "../src/utils/buildWorkDaySummaryText.js"),
  "utf8"
);

test("prioriza la facturación y mantiene la corrección como acción secundaria", () => {
  assert.match(ticket, /Facturación total/);
  assert.match(ticket, /aria-label={`Corregir viaje de/);
  assert.match(ticket, /title="Corregir viaje"/);
  assert.doesNotMatch(ticket, />\s*Corregir viaje\s*</);
});

test("presenta los viajes como una lista horaria compacta", () => {
  assert.match(ticket, /Ordenados por horario/);
  assert.match(ticket, /divide-y divide-slate-800/);
  assert.match(ticket, /Comisión .*Propina/s);
});

test("muestra el total privado de propinas dentro de la jornada", () => {
  assert.match(ticket, /const totalTip = Number\(summary\.tip \|\| 0\)/);
  assert.match(ticket, /Propina personal/);
  assert.match(ticket, /No se comparte en el resumen/);
});

test("muestra las notas internas en los detalles de Matías y Alberto", () => {
  assert.match(ticket, /Nota:<\/span> \{note\}/);
  assert.match(activeTrip, /Nota:<\/span> \{note\}/);
  assert.match(liveDetail, /Nota:<\/span> \{trip\.note\.trim\(\)\}/);
});

test("mantiene las notas privadas fuera de los resúmenes compartidos", () => {
  assert.doesNotMatch(sharedCard, /trip\.note/);
  assert.doesNotMatch(sharedText, /trip\.note/);
});
