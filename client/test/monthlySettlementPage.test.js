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
  assert.match(page, /Facturación total/);
  assert.match(page, /Ganancia promedio neta diaria/);
  assert.match(page, /Neto total del día/);
  assert.match(page, /Ganancia neta Matías/);
  assert.match(page, /Ganancia neta José/);
  assert.match(page, /calculation\.dailySocialSecurity/);
});

test("José revisa y Matías conserva el cierre definitivo", () => {
  assert.match(page, /José puede revisar los datos/);
  assert.match(page, /El cierre definitivo lo confirma Matías/);
  assert.match(page, /Escribe CERRAR/);
});

test("permite guardar datos provisionales y confirmarlos al finalizar el mes", () => {
  assert.match(page, /Datos del mes/);
  assert.match(page, /Guardar cambios/);
  assert.match(page, /saveSettings\(false\)/);
  assert.match(page, /Confirmar datos definitivos/);
  assert.match(page, /saveSettings\(true\)/);
  assert.match(page, /Jornadas trabajadas hasta hoy/);
  assert.match(page, /Seguridad Social aplicada hasta hoy/);
  assert.match(page, /previewAppliedSocialSecurity/);
});

test("el resultado indica correctamente quién entrega el dinero", () => {
  assert.match(page, /Matías entrega a José/);
  assert.match(page, /José entrega a Matías/);
  assert.match(page, /Math\.abs\(calculation\.deliveryToOwner\)/);
});

test("normaliza las fechas SQL antes de presentar cada jornada", () => {
  assert.match(page, /normalizeWorkDayDate\(day\.date\)/);
});

test("Alberto recibe un resumen mensual propio sin el reparto de Lic249", () => {
  assert.match(page, /isSalariedDriverUser/);
  assert.match(page, /Tus jornadas y tu facturación del mes/);
  assert.match(page, /Facturación menos combustible/);
  assert.match(page, /Mis jornadas del mes/);
});
