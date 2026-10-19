const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const sum = (items, field) => roundMoney(
  items.reduce((total, item) => total + Number(item[field] || 0), 0)
);

const calculateDailyMonthlySettlement = ({ summaries, month }) => {
  const settlements = summaries
    .map((summary) => summary.dailySettlement)
    .filter(Boolean);
  const latestSettlement = settlements.at(-1);
  const allPayments = settlements[0]?.payments || [];
  const payments = allPayments.filter((payment) =>
    String(payment.paymentDate || "").startsWith(month)
  );
  const paymentsReceived = roundMoney(
    payments
      .filter((payment) => payment.direction === "OWNER_TO_DRIVER")
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  );
  const paymentsDelivered = roundMoney(
    payments
      .filter((payment) => payment.direction === "DRIVER_TO_OWNER")
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  );

  return {
    workedDays: settlements.length,
    netRevenue: sum(settlements, "netRevenue"),
    cashRetained: sum(settlements, "cashRetained"),
    fuelCost: sum(settlements, "fuelCost"),
    socialSecurity: sum(settlements, "socialSecurity"),
    distributableBase: sum(settlements, "distributableBase"),
    driverShare: sum(settlements, "driverShare"),
    ownerShare: sum(settlements, "ownerShare"),
    reimbursableFuel: sum(settlements, "reimbursableFuel"),
    driverEntitlement: sum(settlements, "driverEntitlement"),
    ownerAdjustment: sum(settlements, "ownerAdjustment"),
    dailyBalance: sum(settlements, "balance"),
    paymentsReceived,
    paymentsDelivered,
    pendingBalance: roundMoney(latestSettlement?.pendingBalance || 0),
    paymentCount: payments.length,
  };
};

module.exports = { calculateDailyMonthlySettlement };
