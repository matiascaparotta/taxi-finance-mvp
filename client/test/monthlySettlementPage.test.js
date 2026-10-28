import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildOwnerMonthlyOverview } from "../src/utils/ownerMonthlyOverview.js";

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

test("el resumen evita avisos redundantes y conserva el cierre protegido", () => {
  assert.doesNotMatch(page, /José puede revisar los datos/);
  assert.doesNotMatch(page, /El cierre definitivo lo confirma Matías/);
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

test("muestra la propina mensual privada y su desglose por jornada", () => {
  assert.match(page, /Propina personal del mes/i);
  assert.match(page, /settlement\.salariedMetrics\?\.tip/);
  assert.match(page, /Propina personal: \{formatCurrency\(day\.tip\)\}/);
  assert.match(page, /No se incluye en los archivos compartidos/);
});

test("Alberto recibe un resumen mensual propio sin el reparto de Lic249", () => {
  assert.match(page, /isSalariedDriverUser/);
  assert.match(page, /Tus jornadas y tu facturación del mes/);
  assert.match(page, /Ganancia promedio diaria/);
  assert.match(page, /dailyMonth\.driverShare/);
  assert.match(page, /Facturación menos combustible/);
  assert.match(page, /LIQUIDACIÓN DIARIA DEL MES/);
  assert.match(page, /Saldo pendiente actual/i);
  assert.match(page, /Recibido del jefe este mes/);
  assert.match(page, /Mis jornadas del mes/);
});

test("el propietario recibe un resumen conjunto y puede entrar por conductor", () => {
  const overview = buildOwnerMonthlyOverview([
    {
      driver: { id: 4, displayName: "David" },
      calculation: {
        workedDays: 2,
        rawRevenue: 300,
        cashGenerated: 100,
        cardGenerated: 200,
        fuelOwn: 30,
      },
      salariedMetrics: { commission: 5 },
    },
    {
      driver: { id: 3, displayName: "Alberto" },
      calculation: {
        workedDays: 3,
        rawRevenue: 450,
        cashGenerated: 150,
        cardGenerated: 300,
        fuelOwn: 45,
      },
      salariedMetrics: { commission: 12 },
    },
  ]);

  assert.deepEqual(overview.totals, {
    workedDays: 5,
    revenue: 750,
    cash: 250,
    card: 500,
    fuel: 75,
    commission: 17,
  });
  assert.match(page, /Resumen de la empresa/);
  assert.match(page, /Facturación conjunta/);
  assert.match(page, /Detalle por persona/);
});
