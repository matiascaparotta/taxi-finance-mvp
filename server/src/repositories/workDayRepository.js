const pool = require("../config/database");

const createWorkDay = async (workDayData) => {
  const { date, startKm, endKm, fuelOwn, fuelJose = 0 } = workDayData;

  const [result] = await pool.query(
    `
    INSERT INTO work_days (
      date,
      start_km,
      end_km,
      fuel_own,
      fuel_jose
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [date, startKm, endKm, fuelOwn, fuelJose]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

const getWorkDays = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    ORDER BY date DESC
    `
  );

  return rows;
};

module.exports = {
  createWorkDay,
  getWorkDays,
};