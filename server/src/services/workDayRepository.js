const pool = require("../config/database");

const createWorkDay = async (workDayData) => {
  const {
    date,
    startKm,
    endKm,
    cash,
    card,
    fuelOwn,
    fuelJose = 0,
  } = workDayData;

  const [result] = await pool.query(
    `
    INSERT INTO work_days (
      date,
      start_km,
      end_km,
      cash,
      card,
      fuel_own,
      fuel_jose
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      date,
      startKm,
      endKm,
      cash,
      card,
      fuelOwn,
      fuelJose,
    ]
  );

  return result.insertId;
};

module.exports = {
  createWorkDay,
};