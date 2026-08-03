import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(
  path.resolve(testDirectory, "../src/pages/MyWorkDayPage.jsx"),
  "utf8"
);

test("Mi jornada concentra el flujo operativo y la cancelación segura", () => {
  assert.match(source, /Iniciar jornada/);
  assert.match(source, /Registrar viaje/);
  assert.match(source, /Cerrar jornada/);
  assert.match(source, /Cancelar jornada activa/);
  assert.match(source, /cancellationPassword/);
  assert.match(source, /cancellationReason/);
  assert.match(source, /CANCELAR/);
});

test("una jornada vacía puede cancelarse sin completar el cierre", () => {
  assert.match(source, /trips\.length === 0/);
  assert.match(source, /No aparecerá en el historial/);
  assert.match(source, /cancellationConfirmation: hasTrips/);
});
