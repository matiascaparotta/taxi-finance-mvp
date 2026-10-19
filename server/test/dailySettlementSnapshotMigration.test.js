const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  BACKUP_TABLES,
} = require("../src/scripts/backupDatabase");

const migration = fs.readFileSync(
  path.resolve(
    __dirname,
    "../database/migrations/025_create_daily_settlement_snapshots.sql"
  ),
  "utf8"
);
const ownerAdjustmentMigration = fs.readFileSync(
  path.resolve(
    __dirname,
    "../database/migrations/027_add_daily_owner_adjustment.sql"
  ),
  "utf8"
);

test("guarda una sola instantánea económica por jornada", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS daily_settlement_snapshots/);
  assert.match(migration, /UNIQUE KEY uq_daily_settlement_work_day \(work_day_id\)/);
  assert.match(migration, /driver_share_basis_points/);
  assert.match(migration, /driver_entitlement/);
  assert.match(migration, /balance_direction ENUM/);
});

test("conserva por separado las cuentas externas a favor del jefe", () => {
  assert.match(ownerAdjustmentMigration, /ADD COLUMN owner_adjustment/);
  assert.match(ownerAdjustmentMigration, /NOT NULL DEFAULT 0/);
});

test("el borrado autorizado de una jornada de prueba retira su instantánea", () => {
  assert.match(
    migration,
    /FOREIGN KEY \(work_day_id\)[\s\S]*ON DELETE CASCADE/
  );
});

test("incluye las instantáneas en el respaldo de producción", () => {
  assert.equal(
    BACKUP_TABLES.includes("daily_settlement_snapshots"),
    true
  );
});
