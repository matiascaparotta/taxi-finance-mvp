import test from "node:test";
import assert from "node:assert/strict";

import { paginateTrips } from "../src/utils/createWorkDayShareCard.js";

const trips = Array.from({ length: 17 }, (_, index) => ({
  id: index + 1,
}));

test("divide el detalle en páginas de hasta ocho viajes", () => {
  assert.deepEqual(
    paginateTrips(trips).map((page) => page.length),
    [8, 8, 1]
  );
});

test("no crea páginas de viajes cuando la jornada está vacía", () => {
  assert.deepEqual(paginateTrips([]), []);
});

test("respeta una página completa sin crear páginas extra", () => {
  assert.deepEqual(
    paginateTrips(trips.slice(0, 8)).map((page) => page.length),
    [8]
  );
});
