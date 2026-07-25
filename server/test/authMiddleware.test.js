const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createRequireActiveUserSession,
  requireCompletedPasswordChange,
  requireOwner,
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

test("reserva la gestión para cuentas propietarias", () => {
  for (const auth of [
    { accessMode: "legacy" },
    { accessMode: "user", roles: { isOwner: false } },
  ]) {
    const response = createResponse();
    let continued = false;
    requireOwner({ auth }, response, () => {
      continued = true;
    });
    assert.equal(continued, false);
    assert.equal(response.statusCode, 403);
  }

  let ownerContinued = false;
  requireOwner(
    {
      auth: {
        accessMode: "user",
        roles: { isOwner: true },
      },
    },
    createResponse(),
    () => {
      ownerContinued = true;
    }
  );
  assert.equal(ownerContinued, true);
});

test("una suspensión invalida una sesión personal existente", async () => {
  const middleware = createRequireActiveUserSession({
    repository: {
      async getUserAccessState() {
        return null;
      },
    },
  });
  const response = createResponse();
  let continued = false;

  await middleware(
    {
      auth: {
        accessMode: "user",
        userId: 5,
        organizationId: 3,
      },
    },
    response,
    () => {
      continued = true;
    }
  );

  assert.equal(continued, false);
  assert.equal(response.statusCode, 401);
  assert.equal(response.body.code, "USER_ACCESS_INACTIVE");
});

test("una contraseña restablecida obliga a cambiarla en sesiones abiertas", async () => {
  const middleware = createRequireActiveUserSession({
    repository: {
      async getUserAccessState() {
        return { active: true, mustChangePassword: true };
      },
    },
  });
  const request = {
    auth: {
      accessMode: "user",
      userId: 5,
      organizationId: 3,
      mustChangePassword: false,
    },
  };

  await middleware(request, createResponse(), () => {});

  assert.equal(request.auth.mustChangePassword, true);
});
