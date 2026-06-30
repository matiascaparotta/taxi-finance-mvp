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
      cash_adjustment AS cashAdjustment
    FROM trips
    WHERE work_day_id = ?
    `,
    [workDayId]
  );

  return {
    workDay: workDayRows[0],
    trips: tripRows,
  };
};

module.exports = {
  getWorkDayWithTrips,
};