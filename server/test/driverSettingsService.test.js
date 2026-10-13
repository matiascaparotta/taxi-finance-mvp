const assert = require("node:assert/strict");
const test = require("node:test");
const { requireDailySettlementScope } = require("../src/services/driverSettingsService");

test("limita la configuración al perfil de liquidación diaria", () => {
  assert.deepEqual(requireDailySettlementScope({ accessMode: "user", settlementMode: "DAILY_50_50", organizationId: 2, userId: 3, roles: { isOwner: false, isDriver: true } }), { organizationId: 2, userId: 3 });
  assert.throws(() => requireDailySettlementScope({ accessMode: "user", settlementMode: "MONTHLY_50_50", roles: { isOwner: false, isDriver: true } }), /perfil asalariado/);
  assert.throws(() => requireDailySettlementScope({ accessMode: "user", settlementMode: "DAILY_50_50", roles: { isOwner: true, isDriver: true } }), /perfil asalariado/);
});
