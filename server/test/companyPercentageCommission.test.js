const assert = require("node:assert/strict");
const test = require("node:test");
const { calculateCompanyCommission } = require("../src/services/tripService");

test("el servidor recalcula una comisión porcentual con dos decimales", () => {
  assert.equal(calculateCompanyCommission(40, { commissionType: "PERCENTAGE", commissionAmount: 10 }), 4);
  assert.equal(calculateCompanyCommission(22.35, { commissionType: "PERCENTAGE", commissionAmount: 10 }), 2.24);
  assert.equal(calculateCompanyCommission(30, { commissionType: "FIXED", commissionAmount: 7 }), null);
});
