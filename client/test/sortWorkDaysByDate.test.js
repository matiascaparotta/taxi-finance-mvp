import test from "node:test";
import assert from "node:assert/strict";

import { sortWorkDaysByDateDescending } from "../src/utils/sortWorkDaysByDate.js";

test("ordena las jornadas desde la fecha más reciente", () => {
  const workDays = [
    { id: 30, date: "2026-07-22" },
    { id: 10, date: "2026-07-24" },
    { id: 20, date: "2026-07-23" },
  ];

  assert.deepEqual(
    sortWorkDaysByDateDescending(workDays).map(
      (workDay) => workDay.id
    ),
    [10, 20, 30]
  );
});

test("usa el identificador solo para desempatar la misma fecha", () => {
  const workDays = [
    { id: 4, date: "2026-07-24" },
    { id: 8, date: "2026-07-24" },
  ];

  assert.deepEqual(
    sortWorkDaysByDateDescending(workDays).map(
      (workDay) => workDay.id
    ),
    [8, 4]
  );
});
