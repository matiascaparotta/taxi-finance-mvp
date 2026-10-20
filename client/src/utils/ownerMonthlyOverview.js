const roundMoney = (value) =>
  Number((Number(value || 0) + Number.EPSILON).toFixed(2));

export const buildOwnerMonthlyOverview = (settlements = []) => {
  const rows = settlements.map((settlement) => ({
    driver: settlement.driver,
    workedDays: Number(settlement.calculation?.workedDays || 0),
    revenue: Number(settlement.calculation?.rawRevenue || 0),
    cash: Number(settlement.calculation?.cashGenerated || 0),
    card: Number(settlement.calculation?.cardGenerated || 0),
    fuel: Number(settlement.calculation?.fuelOwn || 0),
    commission: Number(settlement.salariedMetrics?.commission || 0),
  }));

  return {
    rows,
    totals: rows.reduce(
      (totals, row) => ({
        workedDays: totals.workedDays + row.workedDays,
        revenue: roundMoney(totals.revenue + row.revenue),
        cash: roundMoney(totals.cash + row.cash),
        card: roundMoney(totals.card + row.card),
        fuel: roundMoney(totals.fuel + row.fuel),
        commission: roundMoney(totals.commission + row.commission),
      }),
      {
        workedDays: 0,
        revenue: 0,
        cash: 0,
        card: 0,
        fuel: 0,
        commission: 0,
      }
    ),
  };
};

