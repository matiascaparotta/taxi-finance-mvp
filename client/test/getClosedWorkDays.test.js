import test from "node:test";
import assert from "node:assert/strict";

import { getClosedWorkDays } from "../src/utils/getClosedWorkDays.js";

test("excluye la jornada activa de las jornadas históricas", () => {
  const workDays = [
    { id: 43, status: "OPEN", startKm: 345601, endKm: null },
    { id: 42, status: "CLOSED", startKm: 345548, endKm: 345600 },
    { id: 41, status: "CLOSED", startKm: 3223, endKm: 345548 },
  ];

  assert.deepEqual(
    getClosedWorkDays(workDays).map((workDay) => workDay.id),
    [42, 41]
  );
});

test("devuelve una lista vacía cuando no hay jornadas cerradas", () => {
  assert.deepEqual(
    getClosedWorkDays([{ id: 43, status: "OPEN" }]),
    []
  );
});
