const pool = require("../config/database");

const getMonthlySummaryData = async (userId, month) => {
  const [rows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(cash), 0) AS totalCash,
      COALESCE(SUM(card), 0) AS totalCard,
      COALESCE(SUM(fuel_own), 0) AS totalFuelOwn,
      COALESCE(SUM(fuel_jose), 0) AS totalFuelJose
    FROM work_days
    WHERE user_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?
    `,
    [userId, month]
  );

  return rows[0];
};

module.exports = {
  getMonthlySummaryData,
};
