const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  DEFAULT_RETENTION_DAYS,
  buildDumpArgs,
  removeExpiredBackups,
} = require("../src/scripts/backupDatabase");

test("genera un respaldo autosuficiente con estructura y datos", () => {
  const args = buildDumpArgs(
    "/tmp/mysql-client.cnf",
    "taxfin",
    ["users", "work_days"]
  );

  assert.equal(args.includes("--no-create-info"), false);
  assert.equal(args.includes("--add-drop-table"), true);
  assert.deepEqual(args.slice(-3), [
    "taxfin",
    "users",
    "work_days",
  ]);
});

test("conserva treinta días de respaldos y no toca otros archivos", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "taxfin-retention-"));
  const now = Date.UTC(2026, 9, 20);
  const recent = path.join(directory, "taxfin-2026-10-19T00-00-00-000Z.sql");
  const expired = path.join(directory, "taxfin-2026-08-01T00-00-00-000Z.sql");
  const unrelated = path.join(directory, "notes.txt");

  try {
    await Promise.all([
      fs.writeFile(recent, "recent"),
      fs.writeFile(expired, "expired"),
      fs.writeFile(unrelated, "keep"),
    ]);
    const recentTime = new Date(now - 5 * 24 * 60 * 60 * 1000);
    const expiredTime = new Date(now - 60 * 24 * 60 * 60 * 1000);
    await fs.utimes(recent, recentTime, recentTime);
    await fs.utimes(expired, expiredTime, expiredTime);

    const removed = await removeExpiredBackups(
      directory,
      DEFAULT_RETENTION_DAYS,
      now
    );

    assert.deepEqual(removed, [expired]);
    await assert.doesNotReject(() => fs.access(recent));
    await assert.doesNotReject(() => fs.access(unrelated));
    await assert.rejects(() => fs.access(expired));
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
