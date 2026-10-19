const assert = require("node:assert/strict");
const test = require("node:test");
const {
  REAL_DAYS,
  buildTripTimes,
  interleaveTrips,
  validateDays,
} = require("../src/scripts/importAlbertoRealDays");

test("las dos jornadas reproducen exactamente los totales de la libreta", () => {
  assert.doesNotThrow(validateDays);
  assert.equal(REAL_DAYS[0].cash.reduce((a, b) => a + b, 0).toFixed(2), "105.30");
  assert.equal(REAL_DAYS[0].card.reduce((a, b) => a + b, 0).toFixed(2), "177.73");
  assert.equal(REAL_DAYS[1].cash.reduce((a, b) => a + b, 0).toFixed(2), "6.13");
  assert.equal(REAL_DAYS[1].card.reduce((a, b) => a + b, 0).toFixed(2), "613.28");
});

test("conserva el orden interno al intercalar efectivo y datáfono", () => {
  const trips = interleaveTrips({ cash: [1, 2], card: [10, 20, 30] });
  assert.deepEqual(trips, [
    { amount: 1, paymentType: "cash" },
    { amount: 10, paymentType: "card" },
    { amount: 2, paymentType: "cash" },
    { amount: 20, paymentType: "card" },
    { amount: 30, paymentType: "card" },
  ]);
});

test("distribuye las horas dentro del turno de 16:00 a 04:00", () => {
  const times = buildTripTimes("2026-10-01", 3);
  assert.deepEqual(times, [
    "2026-10-01 19:00:00",
    "2026-10-01 22:00:00",
    "2026-10-02 01:00:00",
  ]);
});
