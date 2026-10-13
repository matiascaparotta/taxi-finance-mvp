export function getPreviousCalendarMonth(month) {
  const [year, monthNumber] = String(month).split("-").map(Number);
  const previous = new Date(Date.UTC(year, monthNumber - 2, 1));
  return `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function buildDailyMonthlyComparison(current, previous) {
  const currentMonth = current?.dailySettlementMonth;
  const previousMonth = previous?.dailySettlementMonth;

  if (!currentMonth || !previousMonth || Number(previousMonth.workedDays) === 0) {
    return null;
  }

  return {
    previousMonth: previous.month,
    rows: [
      {
        label: "Jornadas",
        current: Number(currentMonth.workedDays || 0),
        previous: Number(previousMonth.workedDays || 0),
        difference: Number(currentMonth.workedDays || 0) - Number(previousMonth.workedDays || 0),
        format: "number",
      },
      {
        label: "Facturación neta",
        current: Number(currentMonth.netRevenue || 0),
        previous: Number(previousMonth.netRevenue || 0),
        difference: Number((Number(currentMonth.netRevenue || 0) - Number(previousMonth.netRevenue || 0)).toFixed(2)),
        format: "currency",
      },
      {
        label: "Tu ganancia",
        current: Number(currentMonth.driverShare || 0),
        previous: Number(previousMonth.driverShare || 0),
        difference: Number((Number(currentMonth.driverShare || 0) - Number(previousMonth.driverShare || 0)).toFixed(2)),
        format: "currency",
      },
    ],
  };
}
