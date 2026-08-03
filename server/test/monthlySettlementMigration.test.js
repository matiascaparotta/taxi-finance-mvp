const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const settlementMigration = fs.readFileSync(
  path.resolve(
    __dirname,
    "../database/migrations/016_create_monthly_settlements.sql"
  ),
  "utf8"
);
const auditMigration = fs.readFileSync(
  path.resolve(
    __dirname,
    "../database/migrations/017_create_monthly_settlement_audit_logs.sql"
  ),
  "utf8"
);

test("guarda una sola liquidación compartida por conductor y mes", () => {
  assert.match(settlementMigration, /CREATE TABLE IF NOT EXISTS monthly_settlements/);
  assert.match(
    settlementMigration,
    /UNIQUE KEY uq_monthly_settlement_driver_month[\s\S]*organization_id,[\s\S]*driver_user_id,[\s\S]*settlement_month/
  );
});

test("protege el cierre definitivo y conserva una auditoría", () => {
  assert.match(settlementMigration, /closed_snapshot JSON/);
  assert.match(settlementMigration, /closed_by_user_id INT/);
  assert.match(
    auditMigration,
    /CREATE TABLE IF NOT EXISTS monthly_settlement_audit_logs/
  );
});
