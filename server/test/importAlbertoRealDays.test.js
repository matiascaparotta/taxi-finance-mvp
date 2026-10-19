const assert = require("node:assert/strict");
const test = require("node:test");
const {
  REAL_DAYS,
  buildTripTimes,
  interleaveTrips,
  validateDays,
} = require("../src/scripts/importAlbertoRealDays");

const amount = (value) => typeof value === "object" ? value.amount : value;
const total = (values) => values.reduce((sum, value) => sum + amount(value), 0);

test("las tres jornadas reproducen exactamente los totales de las libretas", () => {
  assert.doesNotThrow(validateDays);
  assert.equal(total(REAL_DAYS[0].cash).toFixed(2), "105.30");
  assert.equal(total(REAL_DAYS[0].card).toFixed(2), "177.73");
  assert.equal(total(REAL_DAYS[1].cash).toFixed(2), "6.13");
  assert.equal(total(REAL_DAYS[1].card).toFixed(2), "613.28");
  assert.equal(total(REAL_DAYS[2].cash).toFixed(2), "75.83");
  assert.equal(total(REAL_DAYS[2].card).toFixed(2), "275.12");
  assert.equal(REAL_DAYS[2].ownerAdjustment, 5);
});

test("conserva el orden interno al intercalar efectivo y datáfono", () => {
  const trips = interleaveTrips({ cash: [1, 2], card: [10, 20, 30] });
  assert.deepEqual(trips, [
    { amount: 1, paymentType: "cash", note: null },
    { amount: 10, paymentType: "card", note: null },
    { amount: 2, paymentType: "cash", note: null },
    { amount: 20, paymentType: "card", note: null },
    { amount: 30, paymentType: "card", note: null },
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
