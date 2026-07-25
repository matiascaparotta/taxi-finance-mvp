const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { BACKUP_TABLES } = require("../src/scripts/backupDatabase");

const migrationsDirectory = path.resolve(
  __dirname,
  "../database/migrations"
);
const migrationFiles = [
  "008_create_organizations.sql",
  "009_create_users.sql",
  "010_create_organization_memberships.sql",
  "011_create_vehicles.sql",
  "012_add_work_day_ownership.sql",
];
const migrations = migrationFiles.map((file) =>
  fs.readFileSync(path.join(migrationsDirectory, file), "utf8")
);
const foundationMigration = migrations.slice(0, 4).join("\n");
const ownershipMigration = migrations[4];
const migration = migrations.join("\n");

test("la base multiusuario crea las entidades sin alterar jornadas", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS organizations/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS users/);
  assert.match(
    migration,
    /CREATE TABLE IF NOT EXISTS organization_memberships/
  );
  assert.match(migration, /CREATE TABLE IF NOT EXISTS vehicles/);
  assert.doesNotMatch(foundationMigration, /ALTER TABLE work_days/);
  assert.doesNotMatch(foundationMigration, /DELETE FROM work_days/);
  assert.doesNotMatch(foundationMigration, /UPDATE work_days/);
});

test("un propietario también puede ser conductor", () => {
  assert.match(
    foundationMigration,
    /is_owner BOOLEAN NOT NULL DEFAULT FALSE/
  );
  assert.match(
    foundationMigration,
    /is_driver BOOLEAN NOT NULL DEFAULT TRUE/
  );
});

test("el combustible admite carga real o tarifa por distancia", () => {
  assert.match(
    foundationMigration,
    /fuel_calculation_mode ENUM\('ACTUAL_LOAD', 'DISTANCE_RATE'\)/
  );
  assert.match(
    migration,
    /fuel_rate_per_km DECIMAL\(8, 4\) DEFAULT NULL/
  );
});

test("el respaldo incluye las nuevas entidades multiusuario", () => {
  assert.deepEqual(BACKUP_TABLES.slice(0, 4), [
    "organizations",
    "users",
    "organization_memberships",
    "vehicles",
  ]);
});

test("la propiedad de jornadas se añade sin reasignar datos", () => {
  assert.match(
    migration,
    /ADD COLUMN organization_id INT DEFAULT NULL/
  );
  assert.match(
    migration,
    /ADD COLUMN driver_user_id INT DEFAULT NULL/
  );
  assert.match(
    migration,
    /ADD COLUMN vehicle_id INT DEFAULT NULL/
  );
  assert.doesNotMatch(
    ownershipMigration,
    /DROP INDEX uq_work_days_date/
  );
  assert.doesNotMatch(ownershipMigration, /UPDATE work_days/);
});
