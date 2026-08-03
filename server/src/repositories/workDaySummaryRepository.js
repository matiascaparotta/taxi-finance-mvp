const pool = require("../config/database");

const getWorkDayWithTrips = async (workDayId) => {
  const [workDayRows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose
    FROM work_days
    WHERE id = ?
    `,
    [workDayId]
  );

  if (workDayRows.length === 0) {
    return null;
  }

  const [tripRows] = await pool.query(
    `
    SELECT
      id,
      amount,
      payment_type AS paymentType,
      commission,
      commission_company_name AS commissionCompanyName,
      commission_rate AS commissionRate,
      tip,
      note
    FROM trips
    WHERE work_day_id = ?
    `,
    [workDayId]
  );

  const [importRows] = await pool.query(
    `
    SELECT
      cash,
      card,
      source
    FROM monthly_work_day_imports
    WHERE date = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [workDayRows[0].date]
  );

  return {
    workDay: workDayRows[0],
    trips: tripRows,
    importedSummary: importRows[0] || null,
  };
};

module.exports = {
  getWorkDayWithTrips,
};
