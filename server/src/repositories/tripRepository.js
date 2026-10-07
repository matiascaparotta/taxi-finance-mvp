const pool = require("../config/database");

const createTrip = async (userId, tripData) => {
  const {
    workDayId,
    amount,
    paymentType,
    commission = 0,
    tip = 0,
    note = null,
    cashAdjustment = 0,
    adjustmentReason = null,
  } = tripData;

  const [result] = await pool.query(
    `
    INSERT INTO trips (
      work_day_id,
      amount,
      payment_type,
      commission,
      tip,
      note,
      cash_adjustment,
      adjustment_reason
    )
    SELECT ?, ?, ?, ?, ?, ?, ?, ?
    FROM work_days
    WHERE id = ? AND user_id = ? AND status = 'OPEN'
    `,
    [
      workDayId,
      amount,
      paymentType,
      commission,
      tip,
      note,
      cashAdjustment,
      adjustmentReason,
      workDayId,
      userId,
    ]
  );

  if (result.affectedRows !== 1) {
    throw new Error("La jornada no existe, no está abierta o no te pertenece");
  }

  const [rows] = await pool.query(
    `
    SELECT
      trips.id,
      trips.work_day_id AS workDayId,
      trips.amount,
      trips.payment_type AS paymentType,
      trips.commission,
      trips.tip,
      trips.note,
      trips.cash_adjustment AS cashAdjustment,
      trips.adjustment_reason AS adjustmentReason,
      trips.created_at AS createdAt,
      trips.updated_at AS updatedAt
    FROM trips
    WHERE id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

const getTripsByWorkDayId = async (userId, workDayId) => {
  const [rows] = await pool.query(
    `
    SELECT
      trips.id,
      trips.work_day_id AS workDayId,
      trips.amount,
      trips.payment_type AS paymentType,
      trips.commission,
      trips.tip,
      trips.note,
      trips.cash_adjustment AS cashAdjustment,
      trips.adjustment_reason AS adjustmentReason,
      trips.created_at AS createdAt,
      trips.updated_at AS updatedAt
    FROM trips
    INNER JOIN work_days ON work_days.id = trips.work_day_id
    WHERE trips.work_day_id = ? AND work_days.user_id = ?
    ORDER BY trips.created_at ASC
    `,
    [workDayId, userId]
  );

  return rows;
};

const getTripById = async (userId, tripId) => {
  const [rows] = await pool.query(
    `
    SELECT
      trips.id,
      trips.work_day_id AS workDayId,
      trips.amount,
      trips.payment_type AS paymentType,
      trips.commission,
      trips.tip,
      trips.note,
      trips.cash_adjustment AS cashAdjustment,
      trips.adjustment_reason AS adjustmentReason,
      trips.created_at AS createdAt,
      trips.updated_at AS updatedAt
    FROM trips
    INNER JOIN work_days ON work_days.id = trips.work_day_id
    WHERE trips.id = ? AND work_days.user_id = ?
    `,
    [tripId, userId]
  );

  return rows[0] || null;
};

const updateTripById = async (userId, tripId, tripData) => {
  const {
    amount,
    paymentType,
    commission = 0,
    tip = 0,
    note = null,
    cashAdjustment = 0,
    adjustmentReason = null,
  } = tripData;

  const [result] = await pool.query(
    `
    UPDATE trips
    SET
      amount = ?,
      payment_type = ?,
      commission = ?,
      tip = ?,
      note = ?,
      cash_adjustment = ?,
      adjustment_reason = ?
    WHERE id = ? AND work_day_id IN (SELECT id FROM work_days WHERE user_id = ?)
    `,
    [
      amount,
      paymentType,
      commission,
      tip,
      note,
      cashAdjustment,
      adjustmentReason,
      tripId,
      userId,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    `
    SELECT
      trips.id,
      trips.work_day_id AS workDayId,
      trips.amount,
      trips.payment_type AS paymentType,
      trips.commission,
      trips.tip,
      trips.note,
      trips.cash_adjustment AS cashAdjustment,
      trips.adjustment_reason AS adjustmentReason,
      trips.created_at AS createdAt,
      trips.updated_at AS updatedAt
    FROM trips
    INNER JOIN work_days ON work_days.id = trips.work_day_id
    WHERE trips.id = ? AND work_days.user_id = ?
    `,
    [tripId, userId]
  );

  return rows[0] || null;
};

const deleteTripById = async (userId, tripId) => {
  const [rows] = await pool.query(
    `
    SELECT
      trips.id,
      trips.work_day_id AS workDayId,
      trips.amount,
      trips.payment_type AS paymentType,
      trips.commission,
      trips.tip,
      trips.note,
      trips.cash_adjustment AS cashAdjustment,
      trips.adjustment_reason AS adjustmentReason,
      trips.created_at AS createdAt,
      trips.updated_at AS updatedAt
    FROM trips
    INNER JOIN work_days ON work_days.id = trips.work_day_id
    WHERE trips.id = ? AND work_days.user_id = ?
    `,
    [tripId, userId]
  );

  if (rows.length === 0) {
    return null;
  }

  await pool.query(
    `
    DELETE FROM trips
    WHERE id = ?
    `,
    [tripId]
  );

  return rows[0];
};

module.exports = {
  createTrip,
  getTripsByWorkDayId,
  getTripById,
  updateTripById,
  deleteTripById,
};
