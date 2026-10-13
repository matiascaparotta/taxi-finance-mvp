import { getDailySettlementPresentation } from "./getDailySettlementPresentation.js";

export function getDailySettlementShareData(settlement) {
  if (!settlement) {
    return null;
  }

  const percentage = Number(settlement.driverSharePercentage || 0);

  return {
    rows: [
      { label: "Facturación neta", value: settlement.netRevenue },
      { label: "Seguridad Social", value: -settlement.socialSecurity },
      { label: "Gasolina", value: -settlement.fuelCost },
      { label: "Base para repartir", value: settlement.distributableBase },
      { label: `Tu parte (${percentage} %)`, value: settlement.driverShare },
      { label: "Parte del jefe", value: settlement.ownerShare },
      { label: "Reintegro gasolina", value: settlement.reimbursableFuel },
      { label: "Total que te corresponde", value: settlement.driverEntitlement },
      { label: "Efectivo conservado", value: settlement.cashRetained },
    ],
    result: getDailySettlementPresentation(settlement),
  };
}
