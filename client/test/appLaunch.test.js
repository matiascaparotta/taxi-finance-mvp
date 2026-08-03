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
