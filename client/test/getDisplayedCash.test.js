import test from "node:test";
import assert from "node:assert/strict";

import { getDisplayedCash } from "../src/utils/getDisplayedCash.js";

test("muestra el efectivo final cuando está disponible", () => {
  assert.equal(
    getDisplayedCash({
      cash: 18.5,
      realCash: 12.3,
    }),
    12.3
  );
});

test("mantiene compatibilidad con resúmenes antiguos", () => {
  assert.equal(getDisplayedCash({ cash: 18.5 }), 18.5);
});

test("devuelve cero cuando todavía no hay resumen", () => {
  assert.equal(getDisplayedCash(null), 0);
});
