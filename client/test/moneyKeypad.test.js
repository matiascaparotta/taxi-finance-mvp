import test from "node:test";
import assert from "node:assert/strict";

import {
  applyMoneyKey,
  parseMoneyInput,
} from "../src/utils/moneyKeypad.js";

test("construye importes con dos decimales", () => {
  const keys = ["3", "2", ",", "5", "0"];
  const value = keys.reduce(applyMoneyKey, "");

  assert.equal(value, "32,50");
  assert.equal(parseMoneyInput(value), 32.5);
});

test("limita el importe a dos decimales", () => {
  assert.equal(applyMoneyKey("3,20", "9"), "3,20");
});

test("permite borrar y empezar con decimales", () => {
  assert.equal(applyMoneyKey("12", "⌫"), "1");
  assert.equal(applyMoneyKey("", ","), "0,");
});
