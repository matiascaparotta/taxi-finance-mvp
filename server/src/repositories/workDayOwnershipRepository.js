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

const findAssignmentTarget = async (
  connection,
  { organizationSlug, username, vehicleName }
) => {
  const [rows] = await connection.query(
    `
    SELECT
      organizations.id AS organizationId,
      users.id AS userId,
      vehicles.id AS vehicleId
    FROM organizations
    INNER JOIN organization_memberships
      ON organization_memberships.organization_id = organizations.id
    INNER JOIN users
      ON users.id = organization_memberships.user_id
    INNER JOIN vehicles
      ON vehicles.organization_id = organizations.id
    WHERE
      organizations.slug = ?
      AND organizations.status = 'ACTIVE'
      AND users.username = ?
      AND users.status = 'ACTIVE'
      AND organization_memberships.status = 'ACTIVE'
      AND organization_memberships.is_driver = TRUE
      AND vehicles.name = ?
      AND vehicles.status = 'ACTIVE'
    `,
    [organizationSlug, username, vehicleName]
  );

  return rows[0] || null;
};

const getOwnershipStats = async (connection, target) => {
  const [rows] = await connection.query(
    `
    SELECT
      COUNT(*) AS total,
      SUM(
        organization_id IS NULL
        AND driver_user_id IS NULL
        AND vehicle_id IS NULL
      ) AS unassigned,
      SUM(
        (organization_id IS NULL)
        + (driver_user_id IS NULL)
        + (vehicle_id IS NULL)
        BETWEEN 1 AND 2
      ) AS partial,
      SUM(
        organization_id = ?
        AND driver_user_id = ?
        AND vehicle_id = ?
      ) AS assignedToTarget,
      SUM(
        organization_id IS NOT NULL
        AND driver_user_id IS NOT NULL
        AND vehicle_id IS NOT NULL
        AND NOT (
          organization_id = ?
          AND driver_user_id = ?
          AND vehicle_id = ?
        )
      ) AS assignedElsewhere
    FROM work_days
    `,
    [
      target.organizationId,
      target.userId,
      target.vehicleId,
      target.organizationId,
      target.userId,
      target.vehicleId,
    ]
  );

  return Object.fromEntries(
    Object.entries(rows[0]).map(([key, value]) => [
      key,
      Number(value || 0),
    ])
  );
};

const lockWorkDays = async (connection) => {
  await connection.query(
    `
    SELECT id
    FROM work_days
    ORDER BY id
    FOR UPDATE
    `
  );
};

const assignUnownedWorkDays = async (connection, target) => {
  const [result] = await connection.query(
    `
    UPDATE work_days
    SET
      organization_id = ?,
      driver_user_id = ?,
      vehicle_id = ?
    WHERE
      organization_id IS NULL
      AND driver_user_id IS NULL
      AND vehicle_id IS NULL
    `,
    [
      target.organizationId,
      target.userId,
      target.vehicleId,
    ]
  );

  return result.affectedRows;
};

module.exports = {
  assignUnownedWorkDays,
  findAssignmentTarget,
  getOwnershipStats,
  lockWorkDays,
  withTransaction,
};
