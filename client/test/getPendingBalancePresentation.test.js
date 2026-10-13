import assert from "node:assert/strict";
import test from "node:test";

import {
  getPendingBalancePresentation,
} from "../src/utils/getPendingBalancePresentation.js";

test("indica cuando el jefe debe el saldo acumulado", () => {
  assert.equal(
    getPendingBalancePresentation(23.22).label,
    "El jefe te debe"
  );
});

test("indica cuando el conductor debe entregar el saldo acumulado", () => {
  assert.equal(
    getPendingBalancePresentation(-10).label,
    "Debes entregar al jefe"
  );
});

test("informa cuando el saldo acumulado está saldado", () => {
  assert.equal(
    getPendingBalancePresentation(0).label,
    "No hay saldo pendiente"
  );
});
