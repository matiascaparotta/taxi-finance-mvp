const test = require("node:test");
const assert = require("node:assert/strict");

const { generateTemporaryPassword } = require("../src/scripts/activateUser");

test("genera una contraseña temporal segura para activar usuarios", () => {
  const first = generateTemporaryPassword();
  const second = generateTemporaryPassword();

  assert.ok(first.length >= 16);
  assert.notEqual(first, second);
});
