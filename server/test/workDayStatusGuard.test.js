const test = require("node:test");
const assert = require("node:assert/strict");

const {
  assertTripBelongsToOpenWorkDay,
} = require("../src/services/workDayStatusGuard");

test("permite modificar viajes de una jornada abierta", async () => {
  await assert.doesNotReject(() =>
    assertTripBelongsToOpenWorkDay(111, async () => "OPEN")
  );
});

test("rechaza modificar viajes de una jornada cerrada", async () => {
  await assert.rejects(
    () => assertTripBelongsToOpenWorkDay(111, async () => "CLOSED"),
    /No se pueden modificar viajes de una jornada cerrada/
  );
});

test("rechaza modificar un viaje inexistente", async () => {
  await assert.rejects(
    () => assertTripBelongsToOpenWorkDay(999, async () => null),
    /Viaje no encontrado/
  );
});
