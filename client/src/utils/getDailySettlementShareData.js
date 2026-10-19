import { getDailySettlementPresentation } from "./getDailySettlementPresentation.js";
import { getPendingBalancePresentation } from "./getPendingBalancePresentation.js";

export function getDailySettlementShareData(settlement, summary = null) {
  if (!settlement) {
    return null;
  }

  const percentage = Number(settlement.driverSharePercentage || 0);

  const pendingBalance = Number(settlement.pendingBalance || 0);
  const totalCommission = Number(summary?.commission || 0);
  const commissionRows = totalCommission > 0
    ? [
        { label: "Comisiones descontadas", value: -totalCommission },
        ...(Number(summary?.cashCommission || 0) > 0
          ? [{ label: "Comisión en efectivo", value: -Number(summary.cashCommission) }]
          : []),
        ...(Number(summary?.cardCommission || 0) > 0
          ? [{ label: "Comisión en datáfono", value: -Number(summary.cardCommission) }]
          : []),
        ...(summary?.commissionByCompany || []).map((company) => ({
          label: `${company.name} (${company.tripCount})`,
          value: -Number(company.amount),
        })),
      ]
    : [];

  return {
    rows: [
      { label: "Facturación neta", value: settlement.netRevenue },
      ...commissionRows,
      { label: "Seguridad Social", value: -settlement.socialSecurity },
      { label: "Gasolina", value: -settlement.fuelCost },
      { label: "Base para repartir", value: settlement.distributableBase },
      { label: `Tu parte (${percentage} %)`, value: settlement.driverShare },
      { label: "Parte del jefe", value: settlement.ownerShare },
      { label: "Reintegro gasolina", value: settlement.reimbursableFuel },
      { label: "Total que te corresponde", value: settlement.driverEntitlement },
      { label: "Efectivo conservado", value: settlement.cashRetained },
      ...(Number(settlement.ownerAdjustment || 0) > 0
        ? [{ label: "Cuenta externa a favor del jefe", value: -settlement.ownerAdjustment }]
        : []),
    ],
    result: getDailySettlementPresentation(settlement),
    pending: {
      amount: Math.abs(pendingBalance),
      ...getPendingBalancePresentation(pendingBalance),
    },
  };
}
