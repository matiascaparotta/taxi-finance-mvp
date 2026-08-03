import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const clientRoot = path.resolve(import.meta.dirname, "..");

test("la aplicación instalada abre siempre en Inicio", () => {
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(clientRoot, "public/manifest.webmanifest"),
      "utf8"
    )
  );

  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
});

test("la página registra el manifiesto de TaxFin", () => {
  const html = fs.readFileSync(
    path.join(clientRoot, "index.html"),
    "utf8"
  );

  assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html, /apple-mobile-web-app-title" content="TaxFin"/);
  assert.match(html, /rel="apple-touch-icon"/);
});

test("mantiene escala de aplicación y fondo oscuro en toda la pantalla", () => {
  const html = fs.readFileSync(
    path.join(clientRoot, "index.html"),
    "utf8"
  );
  const styles = fs.readFileSync(
    path.join(clientRoot, "src/index.css"),
    "utf8"
  );

  assert.match(html, /maximum-scale=1/);
  assert.match(html, /user-scalable=no/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(styles, /html,\s*body,\s*#root/);
  assert.match(styles, /background-color:\s*#020617/);
  assert.match(styles, /overscroll-behavior:\s*none/);
});

test("incluye iconos profesionales para iPhone y Android", () => {
  const expectedIcons = [
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
  ];

  for (const [fileName, expectedSize] of expectedIcons) {
    const png = fs.readFileSync(path.join(clientRoot, "public", fileName));

    assert.equal(png.readUInt32BE(16), expectedSize);
    assert.equal(png.readUInt32BE(20), expectedSize);
  }
});

test("registra una PWA que nunca guarda respuestas financieras", () => {
  const mainSource = fs.readFileSync(
    path.join(clientRoot, "src/main.jsx"),
    "utf8"
  );
  const workerSource = fs.readFileSync(
    path.join(clientRoot, "public/sw.js"),
    "utf8"
  );

  assert.match(mainSource, /registerTaxFinServiceWorker/);
  assert.match(workerSource, /request\.method !== "GET"/);
  assert.match(workerSource, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(workerSource, /SKIP_WAITING/);
  assert.match(workerSource, /__TAXFIN_BUILD_VERSION__/);
});

test("bloquea escrituras cuando el dispositivo está sin conexión", () => {
  const apiSource = fs.readFileSync(
    path.join(clientRoot, "src/services/apiClient.js"),
    "utf8"
  );

  assert.match(apiSource, /navigator\.onLine === false/);
  assert.match(apiSource, /TaxFin no guardó ningún cambio/);
});
