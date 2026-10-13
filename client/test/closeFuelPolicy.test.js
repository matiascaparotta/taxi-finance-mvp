import assert from "node:assert/strict";
import test from "node:test";

import { getCloseFuelPolicy } from "../src/utils/getCloseFuelPolicy.js";

test("el cierre diario exige escribir la gasolina y nunca la reparte", () => {
  assert.deepEqual(
    getCloseFuelPolicy({
      settlementMode: "DAILY_50_50",
      roles: { isOwner: false },
    }),
    {
      isDailySettlement: true,
      isOwnOnly: true,
      initialAmount: "",
    }
  );
});

test("el cierre mensual conserva el flujo actual del conductor", () => {
  assert.deepEqual(
    getCloseFuelPolicy({
      settlementMode: "MONTHLY_50_50",
      roles: { isOwner: false },
    }),
    {
      isDailySettlement: false,
      isOwnOnly: false,
      initialAmount: "0",
    }
  );
});
