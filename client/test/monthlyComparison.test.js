import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDailyMonthlyComparison,
  getPreviousCalendarMonth,
} from "../src/utils/monthlyComparison.js";

test("encuentra el mes calendario anterior incluso al cambiar de año", () => {
  assert.equal(getPreviousCalendarMonth("2026-10"), "2026-09");
  assert.equal(getPreviousCalendarMonth("2026-01"), "2025-12");
});

test("compara jornadas, facturación y ganancia sin recalcular cierres", () => {
  const comparison = buildDailyMonthlyComparison(
    {
      month: "2026-10",
      dailySettlementMonth: { workedDays: 12, netRevenue: 2200.2, driverShare: 900.1 },
    },
    {
      month: "2026-09",
      dailySettlementMonth: { workedDays: 10, netRevenue: 1800.1, driverShare: 750.05 },
    }
  );

  assert.equal(comparison.previousMonth, "2026-09");
  assert.deepEqual(comparison.rows.map((row) => row.difference), [2, 400.1, 150.05]);
});

test("omite la comparación cuando el mes anterior no tiene jornadas", () => {
  assert.equal(
    buildDailyMonthlyComparison(
      { dailySettlementMonth: { workedDays: 2 } },
      { dailySettlementMonth: { workedDays: 0 } }
    ),
    null
  );
});
