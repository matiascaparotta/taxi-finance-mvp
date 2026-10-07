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

test("la sesión conserva la identidad del usuario", () => {
  const secret = "b".repeat(32);
  const token = signSession(secret, 1_000, 10_000, 2);
  const session = readSession(token, secret, 10_500);

  assert.equal(session.userId, 2);
});

test("la sesión puede conservar el perfil visible", () => {
  const secret = "c".repeat(32);
  const identity = { id: 2, fullName: "Alberto Caparotta" };
  const token = signSession(secret, 1_000, 10_000, identity);
  const session = readSession(token, secret, 10_500);

  assert.equal(session.userId, 2);
  assert.equal(session.user.fullName, "Alberto Caparotta");
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
