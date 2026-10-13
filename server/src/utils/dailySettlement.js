const toCents = (value, label) => {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${label} no es válido`);
  }

  return Math.round(number * 100);
};

const fromCents = (value) => Number((value / 100).toFixed(2));

const calculateDailySettlement = ({
  netRevenue,
  cashRetained,
  fuelCost,
  socialSecurity,
  driverShareBasisPoints = 5000,
}) => {
  const netRevenueCents = toCents(netRevenue, "La recaudación neta");
  const cashRetainedCents = toCents(
    cashRetained,
    "El efectivo conservado"
  );
  const fuelCostCents = toCents(fuelCost, "La gasolina");
  const socialSecurityCents = toCents(
    socialSecurity,
    "La Seguridad Social"
  );

  if (
    !Number.isInteger(driverShareBasisPoints) ||
    driverShareBasisPoints < 0 ||
    driverShareBasisPoints > 10000
  ) {
    throw new Error("El porcentaje del conductor no es válido");
  }

  const distributableBaseCents =
    netRevenueCents - socialSecurityCents - fuelCostCents;
  const driverShareCents = Math.round(
    (distributableBaseCents * driverShareBasisPoints) / 10000
  );
  const ownerShareCents = distributableBaseCents - driverShareCents;
  const reimbursableFuelCents = fuelCostCents;
  const driverEntitlementCents =
    driverShareCents + reimbursableFuelCents;
  const balanceCents =
    driverEntitlementCents - cashRetainedCents;

  return {
    netRevenue: fromCents(netRevenueCents),
    socialSecurity: fromCents(socialSecurityCents),
    fuelCost: fromCents(fuelCostCents),
    distributableBase: fromCents(distributableBaseCents),
    driverShare: fromCents(driverShareCents),
    ownerShare: fromCents(ownerShareCents),
    driverSharePercentage: driverShareBasisPoints / 100,
    cashRetained: fromCents(cashRetainedCents),
    reimbursableFuel: fromCents(reimbursableFuelCents),
    driverEntitlement: fromCents(driverEntitlementCents),
    balance: fromCents(balanceCents),
    balanceDirection:
      balanceCents > 0
        ? "OWNER_PAYS_DRIVER"
        : balanceCents < 0
          ? "DRIVER_PAYS_OWNER"
          : "SETTLED",
  };
};

module.exports = {
  calculateDailySettlement,
};
