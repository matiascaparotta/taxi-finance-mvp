const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createLoginAttemptService,
} = require("../src/services/loginAttemptService");

test("los errores de una cuenta no bloquean otra cuenta", () => {
  const attempts = createLoginAttemptService({
    windowMs: 60_000,
    accountLimit: 2,
    addressLimit: 10,
  });

  attempts.recordFailure("proxy", "alberto", 1_000);
  attempts.recordFailure("proxy", "alberto", 1_000);

  assert.deepEqual(
    attempts.getBlock("proxy", "alberto", 1_000),
    { retryAfterSeconds: 60 }
  );
  assert.equal(
    attempts.getBlock("proxy", "david", 1_000),
    null
  );
});

test("mantiene un límite general contra ataques con muchas cuentas", () => {
  const attempts = createLoginAttemptService({
    windowMs: 60_000,
    accountLimit: 5,
    addressLimit: 3,
  });

  attempts.recordFailure("proxy", "cuenta-1", 2_000);
  attempts.recordFailure("proxy", "cuenta-2", 2_000);
  attempts.recordFailure("proxy", "cuenta-3", 2_000);

  assert.deepEqual(
    attempts.getBlock("proxy", "cuenta-4", 2_000),
    { retryAfterSeconds: 60 }
  );
});

test("un acceso correcto limpia el bloqueo de esa cuenta", () => {
  const attempts = createLoginAttemptService({
    windowMs: 60_000,
    accountLimit: 1,
    addressLimit: 10,
  });

  attempts.recordFailure("proxy", "David", 3_000);
  attempts.recordSuccess("proxy", "david");

  assert.equal(
    attempts.getBlock("proxy", "DAVID", 3_000),
    null
  );
});

test("el bloqueo vence y permite volver a intentar", () => {
  const attempts = createLoginAttemptService({
    windowMs: 60_000,
    accountLimit: 1,
    addressLimit: 10,
  });

  attempts.recordFailure("proxy", "alberto", 4_000);

  assert.equal(
    attempts.getBlock("proxy", "alberto", 64_000),
    null
  );
});
