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
