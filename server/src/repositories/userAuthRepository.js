const pool = require("../config/database");

const findActiveUserForLogin = async (username) => {
  const [rows] = await pool.query(
    `
    SELECT
      users.id AS userId,
      users.username,
      users.display_name AS displayName,
      users.password_hash AS passwordHash,
      users.must_change_password AS mustChangePassword,
      organizations.id AS organizationId,
      organizations.name AS organizationName,
      organization_memberships.is_owner AS isOwner,
      organization_memberships.is_driver AS isDriver,
      organization_memberships.fuel_calculation_mode AS fuelCalculationMode,
      organization_memberships.fuel_rate_per_km AS fuelRatePerKm
    FROM users
    INNER JOIN organization_memberships
      ON organization_memberships.user_id = users.id
    INNER JOIN organizations
      ON organizations.id = organization_memberships.organization_id
    WHERE
      users.username = ?
      AND users.status = 'ACTIVE'
      AND organization_memberships.status = 'ACTIVE'
      AND organizations.status = 'ACTIVE'
    ORDER BY organization_memberships.id
    LIMIT 2
    `,
    [username]
  );

  if (rows.length !== 1) {
    return null;
  }

  return rows[0];
};

const findActiveUserForPasswordChange = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      users.id AS userId,
      users.password_hash AS passwordHash
    FROM users
    WHERE
      users.id = ?
      AND users.status = 'ACTIVE'
      AND EXISTS (
        SELECT 1
        FROM organization_memberships
        INNER JOIN organizations
          ON organizations.id = organization_memberships.organization_id
        WHERE
          organization_memberships.user_id = users.id
          AND organization_memberships.status = 'ACTIVE'
          AND organizations.status = 'ACTIVE'
      )
    `,
    [userId]
  );

  return rows[0] || null;
};

const updatePassword = async (
  userId,
  currentPasswordHash,
  newPasswordHash
) => {
  const [result] = await pool.query(
    `
    UPDATE users
    SET
      password_hash = ?,
      must_change_password = FALSE
    WHERE id = ? AND password_hash = ?
    `,
    [newPasswordHash, userId, currentPasswordHash]
  );

  return result.affectedRows === 1;
};

const getUserAccessState = async (userId, organizationId) => {
  const [rows] = await pool.query(
    `
    SELECT
      1 AS active,
      users.must_change_password AS mustChangePassword,
      organization_memberships.is_owner AS isOwner,
      organization_memberships.is_driver AS isDriver,
      organization_memberships.fuel_calculation_mode AS fuelCalculationMode,
      organization_memberships.fuel_rate_per_km AS fuelRatePerKm
    FROM users
    INNER JOIN organization_memberships
      ON organization_memberships.user_id = users.id
    INNER JOIN organizations
      ON organizations.id = organization_memberships.organization_id
    WHERE users.id = ?
      AND organizations.id = ?
      AND users.status = 'ACTIVE'
      AND organization_memberships.status = 'ACTIVE'
      AND organizations.status = 'ACTIVE'
    LIMIT 1
    `,
    [userId, organizationId]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    active: true,
    mustChangePassword: Boolean(rows[0].mustChangePassword),
    isOwner: Boolean(rows[0].isOwner),
    isDriver: Boolean(rows[0].isDriver),
    fuelCalculationMode: rows[0].fuelCalculationMode,
    fuelRatePerKm:
      rows[0].fuelRatePerKm === null
        ? null
        : Number(rows[0].fuelRatePerKm),
  };
};

module.exports = {
  findActiveUserForLogin,
  findActiveUserForPasswordChange,
  getUserAccessState,
  updatePassword,
};
