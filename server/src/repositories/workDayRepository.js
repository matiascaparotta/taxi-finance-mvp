const pool = require("../config/database");

const createWorkDay = async (workDayData) => {
  const { date, startKm } = workDayData;

  const [result] = await pool.query(
    `
    INSERT INTO work_days (
      date,
      start_km,
      status
    )
    VALUES (?, ?, 'OPEN')
    `,
    [date, startKm]
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
      status,
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
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    ORDER BY date DESC
    `
  );

  return rows;
};
const getWorkDayById = async (workDayId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ?
    `,
    [workDayId]
  );

  return rows[0] || null;
};

const getOpenWorkDay = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'OPEN'
    ORDER BY created_at DESC
    LIMIT 1
    `
  );

  return rows[0] || null;
};

const closeWorkDayById = async (workDayId, closeData) => {
  const { endKm, fuelOwn } = closeData;

  await pool.query(
    `
    UPDATE work_days
    SET
      end_km = ?,
      fuel_own = ?,
      status = 'CLOSED'
    WHERE id = ?
    `,
    [endKm, fuelOwn, workDayId]
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
      status,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ?
    `,
    [workDayId]
  );

  return rows[0] || null;
};

module.exports = {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  closeWorkDayById,
};