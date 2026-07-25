import test from "node:test";
import assert from "node:assert/strict";

import {
  APP_NAME,
  getOrganizationFileSlug,
  getWorkDayOrganizationName,
} from "../src/config/branding.js";

test("la aplicación utiliza la marca TaxFin", () => {
  assert.equal(APP_NAME, "TaxFin");
});

test("las tarjetas conservan Lic249 como licencia temporal", () => {
  assert.equal(getWorkDayOrganizationName({}), "Lic249");
  assert.equal(getOrganizationFileSlug({}), "lic249");
});

test("una organización diferente personaliza tarjetas y archivos", () => {
  const workDay = { organizationName: "Licencia Écija 17" };

  assert.equal(
    getWorkDayOrganizationName(workDay),
    "Licencia Écija 17"
  );
  assert.equal(
    getOrganizationFileSlug(workDay),
    "licencia-ecija-17"
  );
});
