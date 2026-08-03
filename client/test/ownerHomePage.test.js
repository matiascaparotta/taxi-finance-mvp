import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const clientRoot = path.resolve(import.meta.dirname, "..");

test("el inicio del propietario reunifica resumen, equipo y acciones", () => {
  const source = fs.readFileSync(
    path.join(clientRoot, "src/components/OwnerActiveWorkDays.jsx"),
    "utf8"
  );

  assert.match(source, /RESUMEN DEL DÍA/);
  assert.match(source, /EQUIPO/);
  assert.match(source, /Ver jornadas/);
  assert.match(source, /Gestionar conductores/);
  assert.match(source, /Fuera de servicio/);
  assert.match(source, /getDisplayedCash/);
  assert.doesNotMatch(source, /getTripsByWorkDay/);
});

test("el propietario consulta el detalle activo sin controles nuevos de escritura", () => {
  const source = fs.readFileSync(
    path.join(clientRoot, "src/components/OwnerActiveWorkDays.jsx"),
    "utf8"
  );

  assert.match(source, /`\/work-days\/\$\{activeWorkDay\.id\}`/);
  assert.doesNotMatch(source, /edit|delete|cancelOpenWorkDay/i);
});
