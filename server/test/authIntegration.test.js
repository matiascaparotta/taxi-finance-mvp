const test = require("node:test");
const assert = require("node:assert/strict");

const { hashPassword } = require("../src/services/authService");

process.env.AUTH_REQUIRED = "true";
process.env.SESSION_SECRET = "test-session-secret-with-32-characters";
process.env.ACCESS_PASSWORD_HASH = hashPassword(
  "clave-correcta",
  Buffer.alloc(16, 3)
);
process.env.CLIENT_ORIGINS = "https://taxi.example";

const app = require("../src/app");

test("protege la API y permite iniciar y cerrar sesión", async () => {
  const server = app.listen(0);

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const unauthorized = await fetch(`${baseUrl}/api/work-days`, {
      headers: {
        Origin: "https://taxi.example",
      },
    });
    assert.equal(unauthorized.status, 401);

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://taxi.example",
      },
      body: JSON.stringify({ password: "clave-correcta" }),
    });
    assert.equal(loginResponse.status, 200);

    const sessionCookie = loginResponse.headers
      .get("set-cookie")
      .split(";")[0];
    const sessionResponse = await fetch(
      `${baseUrl}/api/auth/session`,
      {
        headers: {
          Cookie: sessionCookie,
          Origin: "https://taxi.example",
        },
      }
    );
    const session = await sessionResponse.json();

    assert.equal(session.authenticated, true);
    assert.match(
      sessionResponse.headers.get("set-cookie"),
      /Max-Age=2592000/
    );
    assert.equal(
      loginResponse.headers.get(
        "access-control-allow-credentials"
      ),
      "true"
    );

    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: sessionCookie,
        Origin: "https://taxi.example",
      },
    });

    assert.equal(logoutResponse.status, 200);
    assert.match(
      logoutResponse.headers.get("set-cookie"),
      /Max-Age=0/
    );

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const invalidResponse = await fetch(
        `${baseUrl}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://taxi.example",
          },
          body: JSON.stringify({
            password: "clave-incorrecta",
          }),
        }
      );

      assert.equal(invalidResponse.status, 401);
    }

    const blockedResponse = await fetch(
      `${baseUrl}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://taxi.example",
        },
        body: JSON.stringify({
          password: "clave-correcta",
        }),
      }
    );

    assert.equal(blockedResponse.status, 429);
  } finally {
    server.close();
  }
});
