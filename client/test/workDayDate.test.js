import test from "node:test";
import assert from "node:assert/strict";

import { normalizeWorkDayDate } from "../src/utils/workDayDate.js";

test("normaliza fechas SQL e ISO sin desplazarlas por zona horaria", () => {
  assert.equal(normalizeWorkDayDate("2026-08-03"), "2026-08-03");
  assert.equal(
    normalizeWorkDayDate("2026-08-03T00:00:00.000Z"),
    "2026-08-03"
  );
});

test("rechaza una fecha vacía o ilegible", () => {
  assert.equal(normalizeWorkDayDate(""), "");
  assert.equal(normalizeWorkDayDate("fecha-invalida"), "");
});
