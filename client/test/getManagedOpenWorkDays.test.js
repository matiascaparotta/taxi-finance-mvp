import test from "node:test";
import assert from "node:assert/strict";

import { getManagedOpenWorkDays } from "../src/utils/getManagedOpenWorkDays.js";

test("selecciona únicamente jornadas activas ajenas", () => {
  const workDays = [
    { id: 1, status: "OPEN", canManage: false },
    { id: 2, status: "OPEN", canManage: true },
    { id: 3, status: "CLOSED", canManage: false },
  ];

  assert.deepEqual(getManagedOpenWorkDays(workDays), [workDays[0]]);
});

test("no muestra jornadas si ningún conductor está en servicio", () => {
  assert.deepEqual(
    getManagedOpenWorkDays([
      { id: 1, status: "CLOSED", canManage: false },
    ]),
    []
  );
});
