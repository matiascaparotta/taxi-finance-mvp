const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositorySource = fs.readFileSync(
  path.resolve(__dirname, "../src/repositories/tripRepository.js"),
  "utf8"
);

test("elimina y audita el viaje cerrado dentro de la misma transacción", () => {
  const functionStart = repositorySource.indexOf(
    "const deleteClosedTripWithAudit"
  );
  const functionEnd = repositorySource.indexOf(
    "module.exports",
    functionStart
  );
  const source = repositorySource.slice(functionStart, functionEnd);

  assert.match(source, /beginTransaction\(\)/);
  assert.match(source, /DELETE FROM trips/);
  assert.match(source, /'DELETE'/);
  assert.match(source, /previous_data/);
  assert.match(source, /commit\(\)/);
  assert.match(source, /rollback\(\)/);
});
