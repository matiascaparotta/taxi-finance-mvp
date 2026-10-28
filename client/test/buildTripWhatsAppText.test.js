import assert from "node:assert/strict";
import test from "node:test";

import { buildTripWhatsAppText } from "../src/utils/buildTripWhatsAppText.js";

test("prepara un viaje sencillo según el medio de pago", () => {
  assert.equal(buildTripWhatsAppText({ fareAmount: 25, paymentType: "cash" }), "25,00 E");
  assert.equal(buildTripWhatsAppText({ fareAmount: 27, paymentType: "card" }), "27,00 D");
});

test("explica la comisión en efectivo de un viaje de datáfono", () => {
  assert.equal(
    buildTripWhatsAppText({
      fareAmount: 27,
      paymentType: "card",
      commission: 5,
      commissionCompanyName: "Aviación General",
    }),
    "27,00 D (−5,00 efectivo · comisión Aviación General)"
  );
});

test("incluye las propinas de tarjeta descontadas del efectivo", () => {
  assert.equal(
    buildTripWhatsAppText({ fareAmount: 27, paymentType: "card", commission: 5, tip: 2.5 }),
    "27,00 D (−5,00 efectivo · comisión; −2,50 efectivo · propina)"
  );
});

test("explica cuánto pagó el cliente cuando dejó propina en efectivo", () => {
  assert.equal(
    buildTripWhatsAppText({ fareAmount: 25, paymentType: "cash", tip: 2.5, cashPaid: 27.5 }),
    "25,00 E (propina 2,50 · pagó 27,50 efectivo)"
  );
});
