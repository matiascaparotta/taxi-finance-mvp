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
  const adjustmentRows = (settlement.adjustments || [])
    .filter((adjustment) => Number(adjustment.workDayId) === Number(summary?.workDayId))
    .map((adjustment) => ({
      label: `Ajuste · ${adjustment.reason}`,
      value: adjustment.direction === "OWNER_TO_DRIVER"
        ? Number(adjustment.amount)
        : -Number(adjustment.amount),
    }));
  const balanceEvolutionRows = Number.isFinite(Number(settlement.previousPendingBalance))
    ? [
        { label: "Saldo pendiente anterior", value: settlement.previousPendingBalance },
        { label: "Resultado de esta jornada", value: settlement.originalBalance },
        ...(Number(settlement.currentDayPaymentEffect || 0) !== 0
          ? [{ label: "Pagos registrados este día", value: settlement.currentDayPaymentEffect }]
          : []),
        { label: "Pendiente antes de ajustes", value: settlement.pendingBeforeAdjustments },
        ...adjustmentRows,
        { label: "Saldo pendiente final", value: settlement.pendingBalance },
      ]
    : adjustmentRows;

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
      { label: "Efectivo cobrado conservado", value: settlement.cashRetained },
      ...(Number(settlement.ownerAdjustment || 0) > 0
        ? [{ label: "Efectivo externo para entregar al jefe", value: -settlement.ownerAdjustment }]
        : []),
      ...balanceEvolutionRows,
    ],
    result: getDailySettlementPresentation(settlement),
    pending: {
      amount: Math.abs(pendingBalance),
      ...getPendingBalancePresentation(pendingBalance),
    },
  };
}
