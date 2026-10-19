const pool = require("../config/database");
const { getPendingBalance } = require("./dailySettlementPaymentRepository");

const createAdjustment = async ({
  workDayId,
  organizationId,
  driverUserId,
  direction,
  amount,
  reason,
  idempotencyKey,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [workDays] = await connection.query(
      `SELECT id FROM work_days
       WHERE id = ? AND organization_id = ? AND driver_user_id = ?
         AND status = 'CLOSED'
       FOR UPDATE`,
      [workDayId, organizationId, driverUserId]
    );
    if (workDays.length !== 1) throw new Error("La jornada cerrada no está disponible");

    const [existing] = await connection.query(
      `SELECT id, direction, amount, reason, created_at AS createdAt
       FROM daily_settlement_adjustments
       WHERE idempotency_key = ? AND organization_id = ? AND driver_user_id = ?`,
      [idempotencyKey, organizationId, driverUserId]
    );
    if (existing.length === 1) {
      const row = existing[0];
      if (
        row.direction !== direction ||
        Math.round(Number(row.amount) * 100) !== Math.round(Number(amount) * 100) ||
        row.reason !== reason
      ) throw new Error("La referencia del ajuste ya fue utilizada");
      const pendingBalance = await getPendingBalance(organizationId, driverUserId, connection);
      await connection.commit();
      return { adjustment: row, pendingBalance };
    }

    const [result] = await connection.query(
      `INSERT INTO daily_settlement_adjustments (
         work_day_id, organization_id, driver_user_id, direction, amount,
         reason, idempotency_key, created_by_user_id
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [workDayId, organizationId, driverUserId, direction, amount, reason, idempotencyKey, driverUserId]
    );
    const pendingBalance = await getPendingBalance(organizationId, driverUserId, connection);
    await connection.commit();
    return {
      adjustment: { id: result.insertId, direction, amount: Number(amount), reason },
      pendingBalance,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { createAdjustment };
