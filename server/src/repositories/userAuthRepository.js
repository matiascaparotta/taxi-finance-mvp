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
      organization_memberships.is_driver AS isDriver
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

module.exports = {
  findActiveUserForLogin,
};
