import test from "node:test";
import assert from "node:assert/strict";

import { tripCountLabel } from "../src/utils/tripCountLabel.js";

test("describe de forma sutil la cantidad de viajes por medio de pago", () => {
  assert.equal(tripCountLabel(0), "0 viajes");
  assert.equal(tripCountLabel(1), "1 viaje");
  assert.equal(tripCountLabel(4), "4 viajes");
});
