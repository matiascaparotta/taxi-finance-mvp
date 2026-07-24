import test from "node:test";
import assert from "node:assert/strict";

import {
  filterWorkDaysByDate,
  filterWorkDaysByMonth,
  formatWorkDayMonth,
  getAvailableWorkDayMonths,
} from "../src/utils/workDayMonth.js";

const workDays = [
  { id: 1, date: "2026-06-30" },
  { id: 2, date: "2026-07-01" },
  { id: 3, date: "2026-07-24" },
];

test("obtiene únicamente los meses disponibles", () => {
  assert.deepEqual(getAvailableWorkDayMonths(workDays), [
    "2026-07",
    "2026-06",
  ]);
});

test("filtra las jornadas del mes seleccionado", () => {
  assert.deepEqual(
    filterWorkDaysByMonth(workDays, "2026-07").map(
      (workDay) => workDay.id
    ),
    [2, 3]
  );
});

test("formatea el mes para mostrarlo al usuario", () => {
  assert.equal(formatWorkDayMonth("2026-07"), "Julio 2026");
});

test("busca una jornada por su fecha exacta", () => {
  assert.deepEqual(
    filterWorkDaysByDate(workDays, "2026-07-24").map(
      (workDay) => workDay.id
    ),
    [3]
  );
});

test("devuelve una lista vacía si el día no tiene jornada", () => {
  assert.deepEqual(
    filterWorkDaysByDate(workDays, "2026-07-23"),
    []
  );
});
