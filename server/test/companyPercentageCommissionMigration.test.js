const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const schemaMigration = fs.readFileSync(
  path.resolve(__dirname, "../database/migrations/030_add_percentage_company_commission.sql"),
  "utf8"
);
const dataMigration = fs.readFileSync(
  path.resolve(__dirname, "../database/migrations/031_activate_named_percentage_company.sql"),
  "utf8"
);

test("activa el diez por ciento solo para la empresa que ya lo indica en su nombre", () => {
  assert.match(schemaMigration, /commission_type ENUM\('FIXED', 'PERCENTAGE'\)/);
  assert.match(dataMigration, /LOWER\(name\) LIKE '%10%'/);
  assert.match(dataMigration, /commission_amount = 10\.00/);
});
