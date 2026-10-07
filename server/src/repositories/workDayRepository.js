const pool = require("../config/database");

const createWorkDay = async (userId, workDayData) => {
  const { date, startKm } = workDayData;

  const [result] = await pool.query(
    `
    INSERT INTO work_days (
      user_id,
      date,
      start_km,
      status
    )
    VALUES (?, ?, ?, 'OPEN')
    `,
    [userId, date, startKm]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      status,
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ? AND user_id = ?
    `,
    [result.insertId, userId]
  );

  return rows[0];
};

const getWorkDays = async (userId) => {
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
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE user_id = ?
    ORDER BY date DESC
    `
    , [userId]);

  return rows;
};
const getWorkDayById = async (userId, workDayId) => {
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
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ? AND user_id = ?
    `,
    [workDayId, userId]
  );

  return rows[0] || null;
};

const getOpenWorkDay = async (userId) => {
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
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'OPEN' AND user_id = ?
    ORDER BY created_at DESC
    LIMIT 1
    `
    , [userId]);

  return rows[0] || null;
};

const getLatestClosedWorkDay = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      start_km AS startKm,
      end_km AS endKm,
      status,
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'CLOSED' AND user_id = ?
    ORDER BY date DESC, id DESC
    LIMIT 1
    `
    , [userId]);

  return rows[0] || null;
};

const closeWorkDayById = async (userId, workDayId, closeData) => {
  const { date, endKm, fuelOwn, fuelJose } = closeData;

  await pool.query(
    `
    UPDATE work_days
    SET
      date = ?,
      end_km = ?,
      fuel_own = ?,
      fuel_jose = ?,
      status = 'CLOSED'
    WHERE id = ? AND user_id = ?
    `,
    [date, endKm, fuelOwn, fuelJose, workDayId, userId]
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
      is_locked AS isLocked,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ? AND user_id = ?
    `,
    [workDayId, userId]
  );

  return rows[0] || null;
};

const deleteWorkDayById = async (userId, workDayId) => {
  const [result] = await pool.query(
    "DELETE FROM work_days WHERE id = ? AND user_id = ?",
    [workDayId, userId]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  closeWorkDayById,
  deleteWorkDayById,
};
