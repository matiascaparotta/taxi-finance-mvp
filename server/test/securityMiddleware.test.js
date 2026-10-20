const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applySecurityHeaders,
  attachRequestId,
} = require("../src/middleware/securityMiddleware");

const createResponse = () => {
  const headers = new Map();

  return {
    headers,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
    },
  };
};

test("protege todas las respuestas con cabeceras seguras", () => {
  const response = createResponse();
  let continued = false;

  applySecurityHeaders({}, response, () => {
    continued = true;
  });

  assert.equal(continued, true);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(
    response.headers.get("content-security-policy"),
    /frame-ancestors 'none'/
  );
  assert.equal(
    response.headers.get("permissions-policy"),
    "camera=(), microphone=(), geolocation=()"
  );
});

test("asigna un identificador rastreable a cada solicitud", () => {
  const request = {};
  const response = createResponse();

  attachRequestId(request, response, () => {});

  assert.match(request.requestId, /^[0-9a-f-]{36}$/);
  assert.equal(
    response.headers.get("x-request-id"),
    request.requestId
  );
});
