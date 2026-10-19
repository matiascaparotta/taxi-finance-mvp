const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../database/migrations/030_add_percentage_company_commission.sql"),
  "utf8"
);

test("activa el diez por ciento solo para la empresa que ya lo indica en su nombre", () => {
  assert.match(migration, /commission_type ENUM\('FIXED', 'PERCENTAGE'\)/);
  assert.match(migration, /LOWER\(name\) LIKE '%10%'/);
  assert.match(migration, /commission_amount = 10\.00/);
});
