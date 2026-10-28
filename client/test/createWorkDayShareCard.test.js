import test from "node:test";
import assert from "node:assert/strict";

import {
  createWorkDayShareCard,
  paginateTrips,
  sanitizeTripForSharing,
} from "../src/utils/createWorkDayShareCard.js";
import { getPngDimensions } from "../src/utils/createWorkDaySharePdf.js";
import { getDailySettlementShareData } from "../src/utils/getDailySettlementShareData.js";
import { getWorkDaySharePdfFileName } from "../src/utils/getWorkDayShareFileName.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const shareComponent = fs.readFileSync(path.resolve(testDirectory, "../src/components/WorkDayShareCard.jsx"), "utf8");

const trips = Array.from({ length: 17 }, (_, index) => ({
  id: index + 1,
}));

test("divide el detalle legible en páginas de hasta once viajes", () => {
  assert.deepEqual(
    paginateTrips(trips).map((page) => page.length),
    [11, 6]
  );
});

test("no crea páginas de viajes cuando la jornada está vacía", () => {
  assert.deepEqual(paginateTrips([]), []);
});

test("respeta una página completa sin crear páginas extra", () => {
  assert.deepEqual(
    paginateTrips(trips.slice(0, 11)).map((page) => page.length),
    [11]
  );
});

test("conserva la comisión pero mantiene la propina fuera del archivo compartido", () => {
  assert.deepEqual(
    sanitizeTripForSharing({
      id: 7,
      amount: 20,
      paymentType: "cash",
      commission: 3,
      commissionCompanyName: "Hotel Centro",
      tip: 2,
      createdAt: "2026-08-03T10:30:00.000Z",
    }),
    {
      id: 7,
      amount: 18,
      paymentType: "cash",
      commission: 3,
      commissionCompanyName: "Hotel Centro",
      createdAt: "2026-08-03T10:30:00.000Z",
      created_at: undefined,
    }
  );
});

test("el perfil diario comparte resumen y páginas de viajes en un único PDF", () => {
  assert.equal(typeof createWorkDayShareCard, "function");
  assert.match(shareComponent, /createWorkDayShareCard/);
  assert.match(shareComponent, /createWorkDayShareCards/);
  assert.match(shareComponent, /createWorkDaySharePdf/);
  assert.match(shareComponent, /Compartir jornada en PDF/);
  assert.match(shareComponent, /La portada muestra el resumen y después aparecen todos los viajes/);
});

test("nombra el PDF con la jornada, la fecha y la licencia", () => {
  assert.equal(
    getWorkDaySharePdfFileName({
      date: "2026-10-18T00:00:00.000Z",
      organizationName: "Lic1315",
    }),
    "Jornada 18-10-2026 - Lic1315.pdf"
  );
});

test("lee las dimensiones de cada página PNG antes de incorporarla al PDF", () => {
  const png = new Uint8Array(24);
  png.set([137, 80, 78, 71, 13, 10, 26, 10]);
  new DataView(png.buffer).setUint32(16, 1080);
  new DataView(png.buffer).setUint32(20, 1920);
  assert.deepEqual(getPngDimensions(png), { width: 1080, height: 1920 });
});

test("prepara el desglose y el resultado para la imagen diaria", () => {
  const data = getDailySettlementShareData({
    netRevenue: 283.03,
    socialSecurity: 35,
    fuelCost: 29.01,
    distributableBase: 219.02,
    driverShare: 109.51,
    ownerShare: 109.51,
    driverSharePercentage: 50,
    reimbursableFuel: 29.01,
    driverEntitlement: 138.52,
    cashRetained: 105.3,
    balance: 33.22,
    balanceDirection: "OWNER_PAYS_DRIVER",
    pendingBalance: 23.22,
  });

  assert.equal(data.rows.length, 9);
  assert.deepEqual(data.rows[3], {
    label: "Base para repartir",
    value: 219.02,
  });
  assert.equal(data.result.title, "El jefe debe pagarte");
  assert.equal(data.result.amount, 33.22);
  assert.equal(data.pending.label, "El jefe te debe");
  assert.equal(data.pending.amount, 23.22);
});

test("incluye una cuenta externa del jefe sin tratarla como comisión", () => {
  const data = getDailySettlementShareData({
    netRevenue: 350.95,
    socialSecurity: 35,
    fuelCost: 38.01,
    distributableBase: 277.94,
    driverShare: 138.97,
    ownerShare: 138.97,
    driverSharePercentage: 50,
    reimbursableFuel: 38.01,
    driverEntitlement: 176.98,
    cashRetained: 75.83,
    ownerAdjustment: 5,
    balance: 96.15,
    balanceDirection: "OWNER_PAYS_DRIVER",
    pendingBalance: 96.15,
  });

  assert.deepEqual(data.rows.at(-1), {
    label: "Efectivo externo para entregar al jefe",
    value: -5,
  });
  assert.equal(data.result.amount, 96.15);
});

test("incluye en la imagen la evolución completa del saldo acumulado", () => {
  const data = getDailySettlementShareData({
    netRevenue: 421.64,
    socialSecurity: 35,
    fuelCost: 35,
    distributableBase: 351.64,
    driverShare: 175.82,
    ownerShare: 175.82,
    driverSharePercentage: 50,
    reimbursableFuel: 35,
    driverEntitlement: 210.82,
    cashRetained: 116.05,
    balance: 89.77,
    balanceDirection: "OWNER_PAYS_DRIVER",
    previousPendingBalance: 356.29,
    originalBalance: 94.77,
    pendingBeforeAdjustments: 451.06,
    postCloseAdjustment: -5,
    pendingBalance: 446.06,
    adjustments: [
      { workDayId: 171, direction: "DRIVER_TO_OWNER", amount: 5, reason: "Mati · Aviación General" },
    ],
  }, { workDayId: 171 });

  assert.deepEqual(data.rows.slice(-5), [
    { label: "Saldo pendiente anterior", value: 356.29 },
    { label: "Resultado de esta jornada", value: 94.77 },
    { label: "Pendiente antes de ajustes", value: 451.06 },
    { label: "Ajuste · Mati · Aviación General", value: -5 },
    { label: "Saldo pendiente final", value: 446.06 },
  ]);
});
