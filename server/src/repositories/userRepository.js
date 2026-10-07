const pool = require("../config/database");

const getUserByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT users.id, users.workspace_id AS workspaceId, users.username,
      users.full_name AS fullName, users.taxi_license AS taxiLicense,
      users.role, users.password_hash AS passwordHash,
      users.is_active AS isActive, workspaces.name AS workspaceName
    FROM users INNER JOIN workspaces ON workspaces.id = users.workspace_id
    WHERE users.username = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT users.id, users.workspace_id AS workspaceId, users.username,
      users.full_name AS fullName, users.taxi_license AS taxiLicense,
      users.role, users.is_active AS isActive, workspaces.name AS workspaceName
    FROM users INNER JOIN workspaces ON workspaces.id = users.workspace_id
    WHERE users.id = ? AND users.is_active = TRUE LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

module.exports = { getUserById, getUserByUsername };
