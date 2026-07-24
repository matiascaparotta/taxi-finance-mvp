const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createCorsOptions,
  getAllowedOrigins,
} = require("../src/config/cors");

const checkOrigin = (corsOptions, origin) =>
  new Promise((resolve, reject) => {
    corsOptions.origin(origin, (error, isAllowed) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(isAllowed);
    });
  });

test("permite los orígenes locales durante desarrollo", async () => {
  const corsOptions = createCorsOptions({});

  await assert.doesNotReject(() =>
    checkOrigin(corsOptions, "http://localhost:5173")
  );
  await assert.doesNotReject(() =>
    checkOrigin(corsOptions, "http://127.0.0.1:5173")
  );
});

test("utiliza únicamente los orígenes configurados", async () => {
  const corsOptions = createCorsOptions({
    CLIENT_ORIGINS:
      "https://taxi.example, https://admin.taxi.example/",
  });

  await assert.doesNotReject(() =>
    checkOrigin(corsOptions, "https://taxi.example")
  );
  await assert.doesNotReject(() =>
    checkOrigin(corsOptions, "https://admin.taxi.example")
  );
  await assert.rejects(
    () => checkOrigin(corsOptions, "https://other.example"),
    /Origen no permitido/
  );
});

test("permite solicitudes internas sin cabecera Origin", async () => {
  const corsOptions = createCorsOptions({
    CLIENT_ORIGINS: "https://taxi.example",
  });

  await assert.doesNotReject(() =>
    checkOrigin(corsOptions, undefined)
  );
});

test("exige configurar el origen en producción", () => {
  assert.throws(
    () => getAllowedOrigins({ NODE_ENV: "production" }),
    /CLIENT_ORIGINS es obligatorio/
  );
});
