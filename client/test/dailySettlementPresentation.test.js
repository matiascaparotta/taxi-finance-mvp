import assert from "node:assert/strict";
import test from "node:test";

import { getDailySettlementPresentation } from "../src/utils/getDailySettlementPresentation.js";

test("explica cuando el jefe debe pagar al conductor", () => {
  const result = getDailySettlementPresentation({
    balance: 33.22,
    balanceDirection: "OWNER_PAYS_DRIVER",
  });

  assert.equal(result.title, "El jefe debe pagarte");
  assert.equal(result.amount, 33.22);
  assert.equal(result.tone, "sky");
});

test("explica cuando el conductor debe entregar al jefe", () => {
  const result = getDailySettlementPresentation({
    balance: -22.5,
    balanceDirection: "DRIVER_PAYS_OWNER",
  });

  assert.equal(result.title, "Debes entregar al jefe");
  assert.equal(result.amount, 22.5);
  assert.equal(result.tone, "amber");
});

test("muestra claramente una jornada saldada", () => {
  const result = getDailySettlementPresentation({
    balance: 0,
    balanceDirection: "SETTLED",
  });

  assert.equal(result.title, "La jornada quedó saldada");
  assert.equal(result.amount, 0);
});
