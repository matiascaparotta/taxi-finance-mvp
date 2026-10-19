export function calculateCompanyCommission(amount, company) {
  if (company?.commissionType !== "PERCENTAGE") {
    return Number(company?.commissionAmount || 0);
  }
  const grossAmount = Number(amount || 0);
  const percentage = Number(company.commissionAmount || 0);
  return Math.round((grossAmount * percentage / 100 + Number.EPSILON) * 100) / 100;
}

export function formatCompanyCommission(company) {
  const value = Number(company.commissionAmount || 0).toFixed(2);
  return company.commissionType === "PERCENTAGE" ? `${value} %` : `${value} €`;
}
