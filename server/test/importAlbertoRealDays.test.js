const assert = require("node:assert/strict");
const test = require("node:test");
const {
  REAL_DAYS,
  buildTripTimes,
  interleaveTrips,
  retainedCashCents,
  validateDays,
} = require("../src/scripts/importAlbertoRealDays");

const amount = (value) => typeof value === "object"
  ? value.amount
  : value;
const total = (values) => values.reduce((sum, value) => sum + amount(value), 0);

test("las trece jornadas reproducen exactamente los totales de las libretas", () => {
  assert.doesNotThrow(validateDays);
  const expected = {
    "2026-10-01": ["105.30", "177.73", 0],
    "2026-10-02": ["6.13", "613.28", 0],
    "2026-10-04": ["97.30", "268.09", 5],
    "2026-10-07": ["45.74", "286.93", 0],
    "2026-10-08": ["75.71", "230.90", 5],
    "2026-10-09": ["112.29", "205.91", 0],
    "2026-10-10": ["192.55", "164.31", 0],
    "2026-10-11": ["84.59", "246.43", 0],
    "2026-10-14": ["133.85", "173.28", 0],
    "2026-10-15": ["169.77", "163.75", 0],
    "2026-10-16": ["101.94", "244.70", 0],
    "2026-10-17": ["35.25", "313.64", 0],
    "2026-10-18": ["75.83", "275.12", 5],
  };

  assert.equal(REAL_DAYS.length, 13);
  for (const day of REAL_DAYS) {
    const [cash, card, ownerAdjustment] = expected[day.date];
    assert.equal(total(day.cash).toFixed(2), cash, `${day.date} efectivo`);
    assert.equal(total(day.card).toFixed(2), card, `${day.date} datáfono`);
    assert.equal(day.ownerAdjustment || 0, ownerAdjustment, `${day.date} ajuste`);
    assert.equal(
      (day.ownerAdjustmentBreakdown || []).reduce((sum, item) => sum + item.amount, 0),
      ownerAdjustment,
      `${day.date} desglose del ajuste`
    );
  }
});

test("conserva el desglose legible de las comisiones y ajustes de la libreta", () => {
  const october4 = REAL_DAYS.find((day) => day.date === "2026-10-04");
  assert.deepEqual(october4.ownerAdjustmentBreakdown, [
    { company: "Mati - Aviación General", amount: 5, paymentType: "cash" },
  ]);
  const petitTrip = october4.cash.find((trip) => trip?.commissionCompanyName === "Petit - AGP");
  assert.equal(petitTrip, undefined);
  const normalizedPetit = interleaveTrips(october4).find(
    (trip) => trip.commissionCompanyName === "Petit - AGP"
  );
  assert.deepEqual(normalizedPetit, {
    amount: 28,
    paymentType: "cash",
    commission: 5,
    commissionCompanyName: "Petit - AGP",
    note: "Petit - AGP",
  });
  assert.equal(retainedCashCents(october4.cash), 10230);
});

test("conserva el orden interno al intercalar efectivo y datáfono", () => {
  const trips = interleaveTrips({ cash: [1, 2], card: [10, 20, 30] });
  assert.deepEqual(trips, [
    { amount: 1, paymentType: "cash", commission: 0, commissionCompanyName: null, note: null },
    { amount: 10, paymentType: "card", commission: 0, commissionCompanyName: null, note: null },
    { amount: 2, paymentType: "cash", commission: 0, commissionCompanyName: null, note: null },
    { amount: 20, paymentType: "card", commission: 0, commissionCompanyName: null, note: null },
    { amount: 30, paymentType: "card", commission: 0, commissionCompanyName: null, note: null },
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
