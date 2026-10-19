import assert from "node:assert/strict";
import test from "node:test";
import { calculateCompanyCommission, formatCompanyCommission } from "../src/utils/companyCommission.js";

test("calcula automáticamente una comisión porcentual sobre el importe bruto", () => {
  const company = { commissionType: "PERCENTAGE", commissionAmount: 10 };
  assert.equal(calculateCompanyCommission(40, company), 4);
  assert.equal(calculateCompanyCommission(22.35, company), 2.24);
  assert.equal(formatCompanyCommission(company), "10.00 %");
});

test("conserva las comisiones de importe fijo", () => {
  const company = { commissionType: "FIXED", commissionAmount: 7 };
  assert.equal(calculateCompanyCommission(30, company), 7);
  assert.equal(formatCompanyCommission(company), "7.00 €");
});
