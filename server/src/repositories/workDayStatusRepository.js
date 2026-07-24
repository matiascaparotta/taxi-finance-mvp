const pool = require("../config/database");

const getTripWorkDayStatus = async (tripId) => {
  const [rows] = await pool.query(
    `
    SELECT work_days.status
    FROM trips
    INNER JOIN work_days
      ON work_days.id = trips.work_day_id
    WHERE trips.id = ?
    `,
    [tripId]
  );

  return rows[0]?.status ?? null;
};

module.exports = {
  getTripWorkDayStatus,
};
