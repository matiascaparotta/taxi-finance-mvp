const { getMonthlySummaryData } = require("./summaryRepository");

const roundToTwoDecimals = (value) => {
  return Number(value.toFixed(2));
};

const getMonthlySummary = async () => {
  const summary = await getMonthlySummaryData();

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