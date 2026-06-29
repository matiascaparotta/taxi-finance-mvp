const { getMonthlySummaryData } = require("../repositories/summaryRepository");

const roundToTwoDecimals = (value) => {
  return Number(value.toFixed(2));
};

const getMonthlySummary = async (month) => {
  if (!month) {
    throw new Error("El parámetro month es obligatorio. Ejemplo: 2026-06");
  }

  const monthRegex = /^\d{4}-\d{2}$/;

  if (!monthRegex.test(month)) {
    throw new Error("El parámetro month debe tener formato YYYY-MM");
  }

  const summary = await getMonthlySummaryData(month);

  const totalCash = Number(summary.totalCash);
  const totalCard = Number(summary.totalCard);
  const totalFuelOwn = Number(summary.totalFuelOwn);
  const totalFuelJose = Number(summary.totalFuelJose);

  const totalGenerated = roundToTwoDecimals(totalCash + totalCard);

  return {
    totalCash,
    totalCard,
    totalGenerated,
    totalFuelOwn,
    totalFuelJose,
  };
};

module.exports = {
  getMonthlySummary,
};