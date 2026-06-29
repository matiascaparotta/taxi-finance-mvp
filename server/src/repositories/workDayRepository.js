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
const getAllWorkDays = async () => {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        date,
        start_km AS startKm,
        end_km AS endKm,
        cash,
        card,
        fuel_own AS fuelOwn,
        fuel_jose AS fuelJose,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM work_days
      ORDER BY date DESC, id DESC
      `
    );
  
    return rows;
  };

  module.exports = {
    createWorkDay,
    getAllWorkDays,
  };