const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repository = fs.readFileSync(
  path.resolve(__dirname, "../src/repositories/monthlySettlementRepository.js"),
  "utf8"
);
const service = fs.readFileSync(
  path.resolve(__dirname, "../src/services/monthlySettlementService.js"),
  "utf8"
);
const routes = fs.readFileSync(
  path.resolve(__dirname, "../src/routes/monthlySettlementRoutes.js"),
  "utf8"
);

test("el historial mensual permite consultar todos los años", () => {
  assert.match(repository, /year \? "AND YEAR\(date\) = \?" : ""/);
  assert.match(repository, /year \? "AND YEAR\(settlement_month\) = \?" : ""/);
  assert.match(service, /year \? Number\(year\) : null/);
});

test("conserva el filtro anual opcional para clientes compatibles", () => {
  assert.match(service, /if \(year && !\/\^\\d\{4\}\$\//);
});

test("ofrece una ruta liviana de meses antes del parámetro dinámico", () => {
  const availableIndex = routes.indexOf('router.get("/available"');
  const monthIndex = routes.indexOf('router.get("/:month"');
  assert.ok(availableIndex >= 0);
  assert.ok(availableIndex < monthIndex);
  assert.match(service, /const listAvailableMonths/);
});
