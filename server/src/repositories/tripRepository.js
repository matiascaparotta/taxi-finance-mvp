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

const updateClosedTripWithAudit = async ({
  tripId,
  tripData,
  workDayId,
  organizationId,
  actorUserId,
  reason,
  previousData,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      amount,
      paymentType,
      commission = 0,
      tip = 0,
      note = null,
      cashAdjustment = 0,
      adjustmentReason = null,
    } = tripData;
    const [result] = await connection.query(
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
      WHERE id = ? AND work_day_id = ?
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
        workDayId,
      ]
    );

    if (result.affectedRows !== 1) {
      throw new Error("Viaje no encontrado");
    }

    const [rows] = await connection.query(
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
    const updatedTrip = rows[0];

    await connection.query(
      `
      INSERT INTO correction_audit_logs (
        organization_id,
        actor_user_id,
        work_day_id,
        entity_type,
        entity_id,
        action,
        reason,
        previous_data,
        resulting_data
      )
      VALUES (?, ?, ?, 'TRIP', ?, 'UPDATE', ?, ?, ?)
      `,
      [
        organizationId,
        actorUserId,
        workDayId,
        tripId,
        reason,
        JSON.stringify(previousData),
        JSON.stringify(updatedTrip),
      ]
    );

    await connection.commit();
    return updatedTrip;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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

const deleteClosedTripWithAudit = async ({
  tripId,
  workDayId,
  organizationId,
  actorUserId,
  reason,
  previousData,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      DELETE FROM trips
      WHERE id = ? AND work_day_id = ?
      `,
      [tripId, workDayId]
    );

    if (result.affectedRows !== 1) {
      throw new Error("Viaje no encontrado");
    }

    await connection.query(
      `
      INSERT INTO correction_audit_logs (
        organization_id,
        actor_user_id,
        work_day_id,
        entity_type,
        entity_id,
        action,
        reason,
        previous_data,
        resulting_data
      )
      VALUES (?, ?, ?, 'TRIP', ?, 'DELETE', ?, ?, ?)
      `,
      [
        organizationId,
        actorUserId,
        workDayId,
        tripId,
        reason,
        JSON.stringify(previousData),
        JSON.stringify({ deleted: true }),
      ]
    );

    await connection.commit();
    return previousData;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createTrip,
  getTripsByWorkDayId,
  getTripById,
  updateTripById,
  updateClosedTripWithAudit,
  deleteTripById,
  deleteClosedTripWithAudit,
};
