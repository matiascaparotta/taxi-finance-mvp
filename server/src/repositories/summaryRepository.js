const pool = require("../config/database");

const getMonthlySummaryData = async (month, scope = null) => {
  const accessSql = scope
    ? scope.canReadOrganization
      ? "AND organization_id = ?"
      : "AND organization_id = ? AND driver_user_id = ?"
    : "";
  const accessValues = scope
    ? scope.canReadOrganization
      ? [scope.organizationId]
      : [scope.organizationId, scope.userId]
    : [];

  const [rows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(cash), 0) AS totalCash,
      COALESCE(SUM(card), 0) AS totalCard,
      COALESCE(SUM(fuel_own), 0) AS totalFuelOwn,
      COALESCE(SUM(fuel_jose), 0) AS totalFuelJose
    FROM work_days
    WHERE DATE_FORMAT(date, '%Y-%m') = ?
      ${accessSql}
    `,
    [month, ...accessValues]
  );

  return rows[0];
};

module.exports = {
  getMonthlySummaryData,
};
