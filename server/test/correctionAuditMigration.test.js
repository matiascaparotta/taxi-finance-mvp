const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const migration = fs.readFileSync(
  path.resolve(
    __dirname,
    "../database/migrations/014_create_correction_audit_logs.sql"
  ),
  "utf8"
);

test("la auditoría conserva autor, motivo y valores anterior y resultante", () => {
  assert.match(migration, /actor_user_id INT NOT NULL/);
  assert.match(migration, /reason VARCHAR\(500\) NOT NULL/);
  assert.match(migration, /previous_data JSON NOT NULL/);
  assert.match(migration, /resulting_data JSON NOT NULL/);
  assert.match(migration, /FOREIGN KEY \(work_day_id\)/);
  assert.match(migration, /ON DELETE SET NULL/);
});
