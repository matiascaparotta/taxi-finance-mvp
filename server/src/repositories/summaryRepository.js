const pool = require("../config/database");

const getMonthlySummaryData = async (month) => {
  const [rows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(cash), 0) AS totalCash,
      COALESCE(SUM(card), 0) AS totalCard,
      COALESCE(SUM(fuel_own), 0) AS totalFuelOwn,
      COALESCE(SUM(fuel_jose), 0) AS totalFuelJose
    FROM work_days
    WHERE DATE_FORMAT(date, '%Y-%m') = ?
    `,
    [month]
  );

  return rows[0];
};

module.exports = {
  getMonthlySummaryData,
};