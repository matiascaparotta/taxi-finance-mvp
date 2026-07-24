import test from "node:test";
import assert from "node:assert/strict";

import { getRecentClosedWorkDays } from "../src/utils/getRecentClosedWorkDays.js";

const workDays = [
  { id: 7, date: "2026-07-24", status: "OPEN" },
  { id: 1, date: "2026-07-18", status: "CLOSED" },
  { id: 3, date: "2026-07-20", status: "CLOSED" },
  { id: 2, date: "2026-07-19", status: "CLOSED" },
  { id: 4, date: "2026-07-17", status: "CLOSED" },
  { id: 5, date: "2026-07-16", status: "CLOSED" },
  { id: 6, date: "2026-07-15", status: "CLOSED" },
];

test("selecciona cinco jornadas cerradas aunque exista una activa", () => {
  assert.deepEqual(
    getRecentClosedWorkDays(workDays).map((workDay) => workDay.id),
    [3, 2, 1, 4, 5]
  );
});

test("permite limitar la cantidad de jornadas recientes", () => {
  assert.deepEqual(
    getRecentClosedWorkDays(workDays, 2).map(
      (workDay) => workDay.id
    ),
    [3, 2]
  );
});
