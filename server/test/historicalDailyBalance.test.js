const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repository = fs.readFileSync(
  path.resolve(__dirname, "../src/repositories/workDaySummaryRepository.js"),
  "utf8"
);

test("el saldo histórico no incorpora jornadas ni pagos posteriores", () => {
  assert.match(repository, /all_work_days\.date <= current_work_day\.date/);
  assert.match(repository, /DATE\(payments\.created_at\) <= current_work_day\.date/);
  assert.match(repository, /DATE\(created_at\) <= \?/);
});
