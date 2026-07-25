const assert = require("node:assert/strict");
const test = require("node:test");

const {
  requireCompletedPasswordChange,
} = require("../src/middleware/authMiddleware");

const createResponse = () => ({
  body: null,
  statusCode: 200,
  json(body) {
    this.body = body;
    return this;
  },
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
});

test("bloquea las operaciones con contraseña temporal", () => {
  const response = createResponse();
  let continued = false;

  requireCompletedPasswordChange(
    {
      auth: {
        accessMode: "user",
        mustChangePassword: true,
      },
    },
    response,
    () => {
      continued = true;
    }
  );

  assert.equal(continued, false);
  assert.equal(response.statusCode, 403);
  assert.equal(response.body.code, "PASSWORD_CHANGE_REQUIRED");
});

test("permite cuentas actualizadas y sesiones anteriores", () => {
  for (const auth of [
    {
      accessMode: "user",
      mustChangePassword: false,
    },
    {
      accessMode: "legacy",
    },
  ]) {
    let continued = false;

    requireCompletedPasswordChange(
      { auth },
      createResponse(),
      () => {
        continued = true;
      }
    );

    assert.equal(continued, true);
  }
});
