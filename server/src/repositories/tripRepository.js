const pool = require("../config/database");

const createTrip = async (tripData) => {
  const {
    workDayId,
    amount,
    paymentType,
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
      note,
      cash_adjustment,
      adjustment_reason
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      workDayId,
      amount,
      paymentType,
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
const updateTripById = async (tripId, tripData) => {
  const {
    amount,
    paymentType,
    note = null,
    cashAdjustment = 0,
    adjustmentReason = null,
  } = tripData;

  await pool.query(
    `
    UPDATE trips
    SET
      amount = ?,
      payment_type = ?,
      note = ?,
      cash_adjustment = ?,
      adjustment_reason = ?
    WHERE id = ?
    `,
    [
      amount,
      paymentType,
      note,
      cashAdjustment,
      adjustmentReason,
      tripId,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      work_day_id AS workDayId,
      amount,
      payment_type AS paymentType,
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

  return rows[0];
};

module.exports = {
  createTrip,
  getTripsByWorkDayId,
  updateTripById,
};