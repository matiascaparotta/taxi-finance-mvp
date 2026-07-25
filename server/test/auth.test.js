const test = require("node:test");
const assert = require("node:assert/strict");

const { getAuthConfig } = require("../src/config/auth");
const {
  hashPassword,
  parseCookies,
  readSession,
  serializeSessionCookie,
  signSession,
  verifyPassword,
  verifySession,
} = require("../src/services/authService");

test("genera y valida la huella de una contraseña", () => {
  const storedHash = hashPassword(
    "contraseña-segura",
    Buffer.alloc(16, 7)
  );

  assert.equal(
    verifyPassword("contraseña-segura", storedHash),
    true
  );
  assert.equal(
    verifyPassword("contraseña-incorrecta", storedHash),
    false
  );
});

test("firma sesiones, rechaza alteraciones y respeta la expiración", () => {
  const secret = "a".repeat(32);
  const token = signSession(secret, 1_000, 10_000);

  assert.equal(verifySession(token, secret, 10_500), true);
  assert.equal(verifySession(token, secret, 11_001), false);
  assert.equal(
    verifySession(`${token}alterado`, secret, 10_500),
    false
  );
});

test("la sesión firmada conserva la identidad individual", () => {
  const secret = "b".repeat(32);
  const token = signSession(secret, 1_000, 10_000, {
    accessMode: "user",
    userId: 7,
    username: "mati.caparotta",
    organizationId: 3,
    isOwner: false,
    isDriver: true,
  });
  const session = readSession(token, secret, 10_500);

  assert.equal(session.accessMode, "user");
  assert.equal(session.userId, 7);
  assert.equal(session.username, "mati.caparotta");
  assert.equal(session.organizationId, 3);
  assert.equal(session.isDriver, true);
});

test("crea una cookie privada que JavaScript no puede leer", () => {
  const cookie = serializeSessionCookie("token", {
    secureCookie: true,
    maxAgeSeconds: 60,
  });

  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Expires=/);
  assert.equal(
    parseCookies("other=1; taxi_finance_session=token")
      .taxi_finance_session,
    "token"
  );
});

test("producción exige secretos de acceso válidos", () => {
  assert.throws(
    () => getAuthConfig({ NODE_ENV: "production" }),
    /SESSION_SECRET/
  );

  assert.throws(
    () =>
      getAuthConfig({
        NODE_ENV: "production",
        SESSION_SECRET: "a".repeat(32),
      }),
    /ACCESS_PASSWORD_HASH/
  );
});
