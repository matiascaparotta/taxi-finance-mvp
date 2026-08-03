import test from "node:test";
import assert from "node:assert/strict";

import {
  paginateTrips,
  sanitizeTripForSharing,
} from "../src/utils/createWorkDayShareCard.js";

const trips = Array.from({ length: 17 }, (_, index) => ({
  id: index + 1,
}));

test("divide el detalle en páginas de hasta quince viajes", () => {
  assert.deepEqual(
    paginateTrips(trips).map((page) => page.length),
    [15, 2]
  );
});

test("no crea páginas de viajes cuando la jornada está vacía", () => {
  assert.deepEqual(paginateTrips([]), []);
});

test("respeta una página completa sin crear páginas extra", () => {
  assert.deepEqual(
    paginateTrips(trips.slice(0, 15)).map((page) => page.length),
    [15]
  );
});

test("elimina comisión y propina antes de generar imágenes", () => {
  assert.deepEqual(
    sanitizeTripForSharing({
      id: 7,
      amount: 20,
      paymentType: "cash",
      commission: 3,
      tip: 2,
      createdAt: "2026-08-03T10:30:00.000Z",
    }),
    {
      id: 7,
      amount: 20,
      paymentType: "cash",
      createdAt: "2026-08-03T10:30:00.000Z",
      created_at: undefined,
    }
  );
});
