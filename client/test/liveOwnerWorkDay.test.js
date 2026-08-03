import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(import.meta.dirname, "../src/pages/WorkDayDetailPage.jsx"),
  "utf8"
);

test("José recibe un centro de control para la jornada abierta de Matías", () => {
  assert.match(source, /Centro de control en vivo/);
  assert.match(source, /LIVE_REFRESH_INTERVAL_MS = 10_000/);
  assert.match(source, /ACTIVIDAD EN VIVO/);
  assert.match(source, /Comisiones/);
  assert.match(source, /Propinas/);
  assert.match(source, /Consulta de solo lectura|Solo lectura/);
});

test("una jornada abierta no puede compartirse", () => {
  assert.match(source, /workDay\.status === "CLOSED"/);
  assert.match(
    source,
    /El resumen para compartir estará disponible cuando Matías cierre la jornada/
  );
});

test("la vista en vivo no muestra kilometraje final", () => {
  const liveBranch = source.slice(
    source.indexOf("if (isLiveReadOnly)"),
    source.indexOf("return (\n    <section className=\"space-y-8\">")
  );

  assert.match(liveBranch, /Km inicial/);
  assert.doesNotMatch(liveBranch, /Km final|endKm/);
});

test("simplifica la acción final para eliminar una jornada", () => {
  assert.match(source, />\s*Eliminar jornada\s*</);
  assert.doesNotMatch(source, /Eliminar jornada de prueba/);
  assert.doesNotMatch(source, /Eliminará la jornada completa y todos sus viajes/);
});
