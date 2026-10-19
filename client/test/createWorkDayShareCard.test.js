import test from "node:test";
import assert from "node:assert/strict";

import {
  createWorkDayShareCard,
  paginateTrips,
  sanitizeTripForSharing,
} from "../src/utils/createWorkDayShareCard.js";
import { getDailySettlementShareData } from "../src/utils/getDailySettlementShareData.js";
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

test("conserva comisión, empresa y propina para el control del jefe", () => {
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
      amount: 20,
      paymentType: "cash",
      commission: 3,
      commissionCompanyName: "Hotel Centro",
      tip: 2,
      createdAt: "2026-08-03T10:30:00.000Z",
      created_at: undefined,
    }
  );
});

test("el perfil diario comparte resumen y páginas de viajes", () => {
  assert.equal(typeof createWorkDayShareCard, "function");
  assert.match(shareComponent, /createWorkDayShareCard/);
  assert.match(shareComponent, /createWorkDayShareCards/);
  assert.match(shareComponent, /Compartir resumen y viajes/);
  assert.match(shareComponent, /Resumen primero y control detallado después/);
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
