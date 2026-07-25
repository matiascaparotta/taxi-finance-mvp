const pool = require("../config/database");

const withTransaction = async (operation) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await operation(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const listDrivers = async (organizationId) => {
  const [rows] = await pool.query(
    `
    SELECT
      users.id,
      users.username,
      users.display_name AS displayName,
      organization_memberships.is_owner AS isOwner,
      organization_memberships.fuel_calculation_mode AS fuelCalculationMode,
      organization_memberships.fuel_rate_per_km AS fuelRatePerKm,
      organization_memberships.status
    FROM organization_memberships
    INNER JOIN users ON users.id = organization_memberships.user_id
    WHERE organization_memberships.organization_id = ?
      AND organization_memberships.is_driver = TRUE
    ORDER BY users.display_name, users.id
    `,
    [organizationId]
  );

  return rows;
};

const findUserByUsername = async (connection, username) => {
  const [rows] = await connection.query(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );

  return rows[0] || null;
};

const createDriver = async (
  connection,
  {
    organizationId,
    username,
    displayName,
    passwordHash,
    fuelCalculationMode,
    fuelRatePerKm,
  }
) => {
  const [userResult] = await connection.query(
    `
    INSERT INTO users (
      username,
      display_name,
      password_hash,
      must_change_password
    )
    VALUES (?, ?, ?, TRUE)
    `,
    [username, displayName, passwordHash]
  );

  await connection.query(
    `
    INSERT INTO organization_memberships (
      organization_id,
      user_id,
      is_owner,
      is_driver,
      fuel_calculation_mode,
      fuel_rate_per_km
    )
    VALUES (?, ?, FALSE, TRUE, ?, ?)
    `,
    [
      organizationId,
      userResult.insertId,
      fuelCalculationMode,
      fuelRatePerKm,
    ]
  );

  return {
    id: userResult.insertId,
    username,
    displayName,
    isOwner: false,
    fuelCalculationMode,
    fuelRatePerKm,
    status: "ACTIVE",
  };
};

const findDriverMembership = async (
  organizationId,
  userId
) => {
  const [rows] = await pool.query(
    `
    SELECT
      organization_memberships.id,
      organization_memberships.is_owner AS isOwner,
      organization_memberships.status
    FROM organization_memberships
    WHERE organization_memberships.organization_id = ?
      AND organization_memberships.user_id = ?
      AND organization_memberships.is_driver = TRUE
    `,
    [organizationId, userId]
  );

  return rows[0] || null;
};

const updateDriverStatus = async (
  organizationId,
  userId,
  status
) => {
  const [result] = await pool.query(
    `
    UPDATE organization_memberships
    SET status = ?
    WHERE organization_id = ?
      AND user_id = ?
      AND is_driver = TRUE
      AND is_owner = FALSE
    `,
    [status, organizationId, userId]
  );

  return result.affectedRows > 0;
};

const hasOpenWorkDay = async (organizationId, userId) => {
  const [rows] = await pool.query(
    `
    SELECT 1 AS openWorkDay
    FROM work_days
    WHERE organization_id = ?
      AND driver_user_id = ?
      AND status = 'OPEN'
    LIMIT 1
    `,
    [organizationId, userId]
  );

  return rows.length > 0;
};

const resetDriverPassword = async (userId, passwordHash) => {
  const [result] = await pool.query(
    `
    UPDATE users
    SET
      password_hash = ?,
      must_change_password = TRUE
    WHERE id = ?
    `,
    [passwordHash, userId]
  );

  return result.affectedRows === 1;
};

module.exports = {
  createDriver,
  findDriverMembership,
  findUserByUsername,
  hasOpenWorkDay,
  listDrivers,
  resetDriverPassword,
  updateDriverStatus,
  withTransaction,
};
