const assert = require("node:assert/strict");
const test = require("node:test");

const {
  changePassword,
  getSession,
  login,
} = require("../src/controllers/authController");
const userAuthRepository = require(
  "../src/repositories/userAuthRepository"
);
const {
  hashPassword,
} = require("../src/services/authService");

process.env.AUTH_REQUIRED = "true";
process.env.SESSION_SECRET = "controller-test-secret-with-32-characters";
process.env.ACCESS_PASSWORD_HASH = hashPassword(
  "clave-general",
  Buffer.alloc(16, 4)
);

const createResponse = () => ({
  body: null,
  headers: {},
  statusCode: 200,
  json(body) {
    this.body = body;
    return this;
  },
  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  },
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
});

test("conserva el acceso mediante la contraseña general", async () => {
  const response = createResponse();

  await login(
    {
      body: { password: "clave-general" },
      ip: "legacy-test",
      socket: {},
    },
    response
  );

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.authenticated, true);
  assert.equal(response.body.accessMode, "legacy");
  assert.equal(response.body.user, null);
  assert.match(
    response.headers["set-cookie"],
    /taxi_finance_session=/
  );
});

test("crea y renueva una sesión con identidad individual", async () => {
  const originalFindActiveUserForLogin =
    userAuthRepository.findActiveUserForLogin;
  userAuthRepository.findActiveUserForLogin = async () => ({
    userId: 2,
    username: "mati.caparotta",
    displayName: "Matías Caparotta",
    passwordHash: hashPassword(
      "clave-personal",
      Buffer.alloc(16, 5)
    ),
    mustChangePassword: 1,
    organizationId: 1,
    organizationName: "Lic249",
    isOwner: 0,
    isDriver: 1,
  });

  try {
    const loginResponse = createResponse();

    await login(
      {
        body: {
          username: "mati.caparotta",
          password: "clave-personal",
        },
        ip: "individual-test",
        socket: {},
      },
      loginResponse
    );

    assert.equal(loginResponse.body.accessMode, "user");
    assert.equal(loginResponse.body.user.username, "mati.caparotta");
    assert.equal(loginResponse.body.user.isDriver, true);

    const cookie = loginResponse.headers["set-cookie"].split(";")[0];
    const sessionResponse = createResponse();

    getSession(
      {
        headers: {
          cookie,
        },
      },
      sessionResponse
    );

    assert.equal(sessionResponse.body.authenticated, true);
    assert.equal(sessionResponse.body.accessMode, "user");
    assert.equal(
      sessionResponse.body.user.displayName,
      "Matías Caparotta"
    );
    assert.match(
      sessionResponse.headers["set-cookie"],
      /Max-Age=2592000/
    );
  } finally {
    userAuthRepository.findActiveUserForLogin =
      originalFindActiveUserForLogin;
  }
});

test("actualiza la sesión después de cambiar la contraseña", async () => {
  const originalFind =
    userAuthRepository.findActiveUserForPasswordChange;
  const originalUpdate = userAuthRepository.updatePassword;
  userAuthRepository.findActiveUserForPasswordChange = async () => ({
    userId: 2,
    passwordHash: hashPassword(
      "Temporal123",
      Buffer.alloc(16, 6)
    ),
  });
  userAuthRepository.updatePassword = async () => true;

  try {
    const response = createResponse();

    await changePassword(
      {
        auth: {
          accessMode: "user",
          userId: 2,
          username: "mati.caparotta",
          displayName: "Matías Caparotta",
          organizationId: 1,
          organizationName: "Lic249",
          isOwner: false,
          isDriver: true,
          mustChangePassword: true,
          expiresAt: Date.now() + 1_000,
        },
        body: {
          currentPassword: "Temporal123",
          newPassword: "Personal456",
        },
      },
      response
    );

    assert.equal(response.statusCode, 200);
    assert.equal(response.body.user.mustChangePassword, false);
    assert.match(
      response.headers["set-cookie"],
      /taxi_finance_session=/
    );
  } finally {
    userAuthRepository.findActiveUserForPasswordChange =
      originalFind;
    userAuthRepository.updatePassword = originalUpdate;
  }
});

test("impide cambiar la contraseña desde el acceso anterior", async () => {
  const response = createResponse();

  await changePassword(
    {
      auth: {
        accessMode: "legacy",
      },
      body: {},
    },
    response
  );

  assert.equal(response.statusCode, 403);
  assert.match(response.body.message, /cuenta personal/);
});
