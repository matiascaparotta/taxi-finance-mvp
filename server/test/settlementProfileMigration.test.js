const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const migrationsDirectory = path.resolve(
  __dirname,
  "../database/migrations"
);
const profileMigration = fs.readFileSync(
  path.join(migrationsDirectory, "023_add_settlement_profile.sql"),
  "utf8"
);
const configurationMigration = fs.readFileSync(
  path.join(
    migrationsDirectory,
    "024_configure_existing_settlement_profiles.sql"
  ),
  "utf8"
);

test("añade un perfil de liquidación general a cada relación laboral", () => {
  assert.match(profileMigration, /settlement_mode/);
  assert.match(profileMigration, /'MONTHLY_50_50'/);
  assert.match(profileMigration, /'DAILY_50_50'/);
  assert.match(profileMigration, /driver_share_basis_points/);
});

test("configura a Alberto sin depender de su nombre durante el uso", () => {
  assert.match(configurationMigration, /alberto\.caparotta/);
  assert.match(configurationMigration, /'DAILY_50_50'/);
  assert.match(configurationMigration, /'ACTUAL_LOAD'/);
  assert.match(configurationMigration, /THEN NULL/);
  assert.doesNotMatch(configurationMigration, /DELETE FROM/);
});
