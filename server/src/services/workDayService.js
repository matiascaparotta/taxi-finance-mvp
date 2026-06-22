const { createWorkDay, getAllWorkDays } = require("./workDayRepository");
const MONTHLY_PAYROLL_COST = 330;
const DEFAULT_WORKED_DAYS_IN_MONTH = 22;

const roundToTwoDecimals = (value) => {
  return Number(value.toFixed(2));
};

const processWorkDay = async (workDayData) => {
  const { date, startKm, endKm, cash, card, fuelOwn, fuelJose = 0 } = workDayData;

  if (!date) {
    throw new Error("La fecha es obligatoria");
  }

  if (endKm < startKm) {
    throw new Error("El kilometraje final no puede ser menor que el inicial");
  }

  if (cash < 0 || card < 0 || fuelOwn < 0 || fuelJose < 0) {
    throw new Error("Los importes no pueden ser negativos");
  }
  const getWorkDays = async () => {
    const workDays = await getAllWorkDays();
  
    return workDays;
  };
  const workedKm = endKm - startKm;
  const totalGenerated = roundToTwoDecimals(cash + card);

  const dailyPayrollCost = roundToTwoDecimals(
    MONTHLY_PAYROLL_COST / DEFAULT_WORKED_DAYS_IN_MONTH
  );

  const netProfit = roundToTwoDecimals(
    (totalGenerated - fuelOwn - dailyPayrollCost) / 2
  );

  const workDayId = await createWorkDay(workDayData);

  return {
    id: workDayId,
    date,
    startKm,
    endKm,
    workedKm,
    cash,
    card,
    totalGenerated,
    fuelOwn,
    fuelJose,
    dailyPayrollCost,
    netProfit,
  };
};
const getWorkDays = async () => {
  const workDays = await getAllWorkDays();

  return workDays;
};

module.exports = {
  processWorkDay,
  getWorkDays,
};