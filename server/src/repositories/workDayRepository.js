const pool = require("../config/database");

const createWorkDay = async (workDayData, scope = null) => {
  const { date, startKm } = workDayData;

  const [result] = await pool.query(
    `
    INSERT INTO work_days (
      date,
      start_km,
      status,
      organization_id,
      driver_user_id,
      vehicle_id
    )
    VALUES (
      ?,
      ?,
      'OPEN',
      ?,
      ?,
      (
        SELECT id
        FROM vehicles
        WHERE organization_id = ?
          AND status = 'ACTIVE'
        ORDER BY id
        LIMIT 1
      )
    )
    `,
    [
      date,
      startKm,
      scope?.organizationId || null,
      scope?.userId || null,
      scope?.organizationId || null,
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      id,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      status,
      is_locked AS isLocked,
      organization_id AS organizationId,
      driver_user_id AS driverUserId,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

const buildScopeClause = (scope, tableName = "work_days") => {
  if (!scope) {
    return { sql: "", values: [] };
  }

  if (scope.canReadOrganization) {
    return {
      sql: ` AND ${tableName}.organization_id = ?`,
      values: [scope.organizationId],
    };
  }

  return {
    sql: ` AND ${tableName}.organization_id = ?
      AND ${tableName}.driver_user_id = ?`,
    values: [scope.organizationId, scope.userId],
  };
};

const getWorkDays = async (scope = null) => {
  const access = buildScopeClause(scope);
  const [rows] = await pool.query(
    `
    SELECT
      work_days.id,
      work_days.date,
      work_days.start_km AS startKm,
      work_days.end_km AS endKm,
      work_days.fuel_own AS fuelOwn,
      work_days.fuel_jose AS fuelJose,
      work_days.status,
      work_days.is_locked AS isLocked,
      work_days.organization_id AS organizationId,
      work_days.driver_user_id AS driverUserId,
      users.display_name AS driverName,
      work_days.created_at AS createdAt,
      work_days.updated_at AS updatedAt
    FROM work_days
    LEFT JOIN users ON users.id = work_days.driver_user_id
    WHERE 1 = 1
      ${access.sql}
    ORDER BY work_days.date DESC, work_days.id DESC
    `,
    access.values
  );

  return rows;
};
const getWorkDayById = async (workDayId, scope = null) => {
  const access = buildScopeClause(scope);
  const [rows] = await pool.query(
    `
    SELECT
      work_days.id,
      work_days.date,
      work_days.start_km AS startKm,
      work_days.end_km AS endKm,
      work_days.fuel_own AS fuelOwn,
      work_days.fuel_jose AS fuelJose,
      work_days.status,
      work_days.is_locked AS isLocked,
      work_days.organization_id AS organizationId,
      work_days.driver_user_id AS driverUserId,
      users.display_name AS driverName,
      work_days.created_at AS createdAt,
      work_days.updated_at AS updatedAt
    FROM work_days
    LEFT JOIN users ON users.id = work_days.driver_user_id
    WHERE work_days.id = ?
      ${access.sql}
    `,
    [workDayId, ...access.values]
  );

  return rows[0] || null;
};

const getOpenWorkDay = async (scope = null) => {
  const access = buildScopeClause(scope);
  const [rows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose,
      status,
      is_locked AS isLocked,
      organization_id AS organizationId,
      driver_user_id AS driverUserId,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'OPEN'
      ${access.sql}
    ORDER BY created_at DESC
    LIMIT 1
    `,
    access.values
  );

  return rows[0] || null;
};

const getLatestClosedWorkDay = async (scope = null) => {
  const access = buildScopeClause(scope);
  const [rows] = await pool.query(
    `
    SELECT
      id,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      start_km AS startKm,
      end_km AS endKm,
      status,
      is_locked AS isLocked,
      organization_id AS organizationId,
      driver_user_id AS driverUserId,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'CLOSED'
      ${access.sql}
    ORDER BY date DESC, id DESC
    LIMIT 1
    `,
    access.values
  );

  return rows[0] || null;
};

const getLatestVehicleClosedWorkDay = async (scope = null) => {
  if (!scope) {
    return getLatestClosedWorkDay();
  }

  const [rows] = await pool.query(
    `
    SELECT
      id,
      DATE_FORMAT(date, '%Y-%m-%d') AS date,
      start_km AS startKm,
      end_km AS endKm,
      status,
      is_locked AS isLocked,
      organization_id AS organizationId,
      driver_user_id AS driverUserId,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM work_days
    WHERE status = 'CLOSED'
      AND organization_id = ?
      AND vehicle_id = (
        SELECT id
        FROM vehicles
        WHERE organization_id = ?
          AND status = 'ACTIVE'
        ORDER BY id
        LIMIT 1
      )
    ORDER BY date DESC, created_at DESC, id DESC
    LIMIT 1
    `,
    [scope.organizationId, scope.organizationId]
  );

  return rows[0] || null;
};

const closeWorkDayById = async (workDayId, closeData, scope = null) => {
  const { date, endKm, fuelOwn, fuelJose } = closeData;
  const access = buildScopeClause(scope);

  await pool.query(
    `
    UPDATE work_days
    SET
      date = ?,
      end_km = ?,
      fuel_own = ?,
      fuel_jose = ?,
      status = 'CLOSED'
    WHERE id = ?
      ${access.sql}
    `,
    [date, endKm, fuelOwn, fuelJose, workDayId, ...access.values]
  );

  return getWorkDayById(workDayId, scope);
};

const deleteWorkDayById = async (workDayId, scope = null) => {
  const access = buildScopeClause(scope);
  const [result] = await pool.query(
    `DELETE FROM work_days WHERE id = ? ${access.sql}`,
    [workDayId, ...access.values]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createWorkDay,
  getWorkDays,
  getWorkDayById,
  getOpenWorkDay,
  getLatestClosedWorkDay,
  getLatestVehicleClosedWorkDay,
  closeWorkDayById,
  deleteWorkDayById,
};
