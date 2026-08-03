const pool = require("../config/database");

const getDriver = async (organizationId, driverUserId) => {
  const [rows] = await pool.query(
    `
    SELECT
      users.id,
      users.display_name AS displayName,
      organization_memberships.is_owner AS isOwner,
      organization_memberships.is_driver AS isDriver
    FROM organization_memberships
    INNER JOIN users ON users.id = organization_memberships.user_id
    WHERE organization_memberships.organization_id = ?
      AND organization_memberships.user_id = ?
      AND organization_memberships.status = 'ACTIVE'
      AND users.status = 'ACTIVE'
    `,
    [organizationId, driverUserId]
  );
  return rows[0] || null;
};

const getClosedWorkDays = async (
  organizationId,
  driverUserId,
  month
) => {
  const [rows] = await pool.query(
    `
    SELECT id, DATE_FORMAT(date, '%Y-%m-%d') AS date
    FROM work_days
    WHERE organization_id = ?
      AND driver_user_id = ?
      AND status = 'CLOSED'
      AND DATE_FORMAT(date, '%Y-%m') = ?
    ORDER BY date, id
    `,
    [organizationId, driverUserId, month]
  );
  return rows;
};

const getAvailableMonths = async (organizationId, driverUserId, year) => {
  const [rows] = await pool.query(
    `
    SELECT DISTINCT DATE_FORMAT(date, '%Y-%m') AS month
    FROM work_days
    WHERE organization_id = ?
      AND driver_user_id = ?
      AND status = 'CLOSED'
      AND YEAR(date) = ?
    UNION
    SELECT DISTINCT DATE_FORMAT(settlement_month, '%Y-%m') AS month
    FROM monthly_settlements
    WHERE organization_id = ?
      AND driver_user_id = ?
      AND YEAR(settlement_month) = ?
    ORDER BY month DESC
    `,
    [organizationId, driverUserId, year, organizationId, driverUserId, year]
  );
  return rows.map((row) => row.month);
};

const getSettlement = async (organizationId, driverUserId, month) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      expected_work_days AS expectedWorkDays,
      social_security AS socialSecurity,
      payroll_transfer AS payrollTransfer,
      settings_confirmed AS settingsConfirmed,
      status,
      closed_snapshot AS closedSnapshot,
      closed_at AS closedAt,
      closed_by_user_id AS closedByUserId,
      updated_at AS updatedAt
    FROM monthly_settlements
    WHERE organization_id = ?
      AND driver_user_id = ?
      AND settlement_month = CONCAT(?, '-01')
    `,
    [organizationId, driverUserId, month]
  );
  return rows[0] || null;
};

const saveSettings = async ({
  organizationId,
  driverUserId,
  month,
  expectedWorkDays,
  socialSecurity,
  payrollTransfer,
  actorUserId,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [previousRows] = await connection.query(
      `SELECT * FROM monthly_settlements
       WHERE organization_id = ? AND driver_user_id = ?
         AND settlement_month = CONCAT(?, '-01')
       FOR UPDATE`,
      [organizationId, driverUserId, month]
    );
    if (previousRows[0]?.status === "CLOSED") {
      throw new Error("Una liquidación cerrada no puede modificarse");
    }
    await connection.query(
      `
      INSERT INTO monthly_settlements (
        organization_id, driver_user_id, settlement_month,
        expected_work_days, social_security, payroll_transfer,
        settings_confirmed, created_by_user_id, updated_by_user_id
      ) VALUES (?, ?, CONCAT(?, '-01'), ?, ?, ?, TRUE, ?, ?)
      ON DUPLICATE KEY UPDATE
        expected_work_days = VALUES(expected_work_days),
        social_security = VALUES(social_security),
        payroll_transfer = VALUES(payroll_transfer),
        settings_confirmed = TRUE,
        updated_by_user_id = VALUES(updated_by_user_id)
      `,
      [organizationId, driverUserId, month, expectedWorkDays,
        socialSecurity, payrollTransfer, actorUserId, actorUserId]
    );
    const [resultRows] = await connection.query(
      `SELECT * FROM monthly_settlements
       WHERE organization_id = ? AND driver_user_id = ?
         AND settlement_month = CONCAT(?, '-01')`,
      [organizationId, driverUserId, month]
    );
    await addAudit(connection, {
      settlementId: resultRows[0].id,
      organizationId,
      actorUserId,
      action: "UPDATE_SETTINGS",
      reason: "Revisión de Seguridad Social, nómina y días previstos",
      previous: previousRows[0] || {},
      resulting: resultRows[0],
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getSettlement(organizationId, driverUserId, month);
};

const addAudit = async (
  connection,
  { settlementId, organizationId, actorUserId, action, reason, previous, resulting }
) => {
  await connection.query(
    `
    INSERT INTO monthly_settlement_audit_logs (
      monthly_settlement_id,
      organization_id,
      actor_user_id,
      action,
      reason,
      previous_data,
      resulting_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      settlementId,
      organizationId,
      actorUserId,
      action,
      reason,
      JSON.stringify(previous || {}),
      JSON.stringify(resulting || {}),
    ]
  );
};

const closeSettlement = async ({
  organizationId,
  driverUserId,
  month,
  actorUserId,
  snapshot,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      `SELECT * FROM monthly_settlements
       WHERE organization_id = ? AND driver_user_id = ?
         AND settlement_month = CONCAT(?, '-01')
       FOR UPDATE`,
      [organizationId, driverUserId, month]
    );
    const previous = rows[0];
    if (!previous || previous.status === "CLOSED") {
      throw new Error(
        previous ? "La liquidación ya está cerrada" : "Confirma primero los datos mensuales"
      );
    }
    await connection.query(
      `UPDATE monthly_settlements
       SET status = 'CLOSED', closed_snapshot = ?, closed_at = CURRENT_TIMESTAMP,
           closed_by_user_id = ?, updated_by_user_id = ?
       WHERE id = ?`,
      [JSON.stringify(snapshot), actorUserId, actorUserId, previous.id]
    );
    await addAudit(connection, {
      settlementId: previous.id,
      organizationId,
      actorUserId,
      action: "CLOSE",
      reason: "Cierre mensual confirmado por el conductor",
      previous,
      resulting: snapshot,
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getSettlement(organizationId, driverUserId, month);
};

module.exports = {
  closeSettlement,
  getAvailableMonths,
  getClosedWorkDays,
  getDriver,
  getSettlement,
  saveSettings,
};
