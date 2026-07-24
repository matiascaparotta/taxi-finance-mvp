const pool = require("../config/database");

const createTrip = async (tripData) => {
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
      commission,
      tip,
      note,
      cash_adjustment AS cashAdjustment,
      adjustment_reason AS adjustmentReason,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM trips
    WHERE id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

const getTripsByWorkDayId = async (workDayId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
      commission,
      tip,
      note,
      cash_adjustment AS cashAdjustment,
      adjustment_reason AS adjustmentReason,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM trips
    WHERE work_day_id = ?
    ORDER BY created_at ASC
    `,
    [workDayId]
  );

  return rows;
};

const getTripById = async (tripId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
      commission,
      tip,
      note,
      cash_adjustment AS cashAdjustment,
      adjustment_reason AS adjustmentReason,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM trips
    WHERE id = ?
    `,
    [tripId]
  );

  return rows[0] || null;
};

const updateTripById = async (tripId, tripData) => {
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
    WHERE id = ?
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
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
      commission,
      tip,
      note,
      cash_adjustment AS cashAdjustment,
      adjustment_reason AS adjustmentReason,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM trips
    WHERE id = ?
    `,
    [tripId]
  );

  return rows[0] || null;
};

const deleteTripById = async (tripId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
      commission,
      tip,
      note,
      cash_adjustment AS cashAdjustment,
      adjustment_reason AS adjustmentReason,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM trips
    WHERE id = ?
    `,
    [tripId]
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