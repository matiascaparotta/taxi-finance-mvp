const pool = require("../config/database");
const {
  getPaymentDirection,
  validatePaymentAgainstBalance,
} = require("../utils/dailySettlementPayment");

const getPendingBalance = async (
  organizationId,
  driverUserId,
  connection = pool
) => {
  const [rows] = await connection.query(
    `SELECT
       COALESCE((
         SELECT SUM(balance)
         FROM daily_settlement_snapshots
         WHERE organization_id = ? AND driver_user_id = ?
       ), 0) + COALESCE((
         SELECT SUM(
           CASE
             WHEN direction = 'OWNER_TO_DRIVER' THEN -amount
             ELSE amount
           END
         )
         FROM daily_settlement_payments
         WHERE organization_id = ? AND driver_user_id = ?
       ), 0) + COALESCE((
         SELECT SUM(
           CASE
             WHEN direction = 'OWNER_TO_DRIVER' THEN amount
             ELSE -amount
           END
         )
         FROM daily_settlement_adjustments
         WHERE organization_id = ? AND driver_user_id = ?
       ), 0) AS pendingBalance`,
    [
      organizationId, driverUserId,
      organizationId, driverUserId,
      organizationId, driverUserId,
    ]
  );

  return Number(rows[0].pendingBalance || 0);
};

const createPayment = async ({
  organizationId,
  driverUserId,
  amount,
  idempotencyKey,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [membershipRows] = await connection.query(
      `SELECT user_id
       FROM organization_memberships
       WHERE organization_id = ? AND user_id = ? AND status = 'ACTIVE'
       FOR UPDATE`,
      [organizationId, driverUserId]
    );

    if (membershipRows.length !== 1) {
      throw new Error("La relación laboral no está activa");
    }

    const [existingRows] = await connection.query(
      `SELECT id, direction, amount, created_at AS createdAt
       FROM daily_settlement_payments
       WHERE idempotency_key = ?
         AND organization_id = ? AND driver_user_id = ?`,
      [idempotencyKey, organizationId, driverUserId]
    );

    if (existingRows.length === 1) {
      const existingAmountInCents = Math.round(
        Number(existingRows[0].amount) * 100
      );
      const requestedAmountInCents = Math.round(Number(amount) * 100);
      if (existingAmountInCents !== requestedAmountInCents) {
        throw new Error("La referencia del pago ya fue utilizada");
      }

      const pendingBalance = await getPendingBalance(
        organizationId,
        driverUserId,
        connection
      );
      await connection.commit();
      return { payment: existingRows[0], pendingBalance };
    }

    const pendingBalanceBefore = await getPendingBalance(
      organizationId,
      driverUserId,
      connection
    );
    validatePaymentAgainstBalance(amount, pendingBalanceBefore);
    const direction = getPaymentDirection(pendingBalanceBefore);
    const [result] = await connection.query(
      `INSERT INTO daily_settlement_payments (
         organization_id, driver_user_id, direction, amount,
         idempotency_key, created_by_user_id
       ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        organizationId,
        driverUserId,
        direction,
        amount,
        idempotencyKey,
        driverUserId,
      ]
    );
    const pendingBalance = await getPendingBalance(
      organizationId,
      driverUserId,
      connection
    );

    await connection.commit();

    return {
      payment: {
        id: result.insertId,
        direction,
        amount: Number(amount),
      },
      pendingBalance,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createPayment,
  getPendingBalance,
};
