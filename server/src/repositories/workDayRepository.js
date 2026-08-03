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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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
      (
        SELECT name
        FROM organizations
        WHERE organizations.id = work_days.organization_id
      ) AS organizationName,
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

const deleteWorkDayWithAudit = async ({
  workDayId,
  organizationId,
  actorUserId,
  reason,
  previousData,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [tripRows] = await connection.query(
      `SELECT id, work_day_id AS workDayId, amount, payment_type AS paymentType,
        commission, tip, note, created_at AS createdAt
       FROM trips WHERE work_day_id = ? ORDER BY created_at, id`,
      [workDayId]
    );

    await connection.query(
      `INSERT INTO correction_audit_logs (
        organization_id, actor_user_id, work_day_id, entity_type,
        entity_id, action, reason, previous_data, resulting_data
      ) VALUES (?, ?, ?, 'WORK_DAY', ?, 'DELETE', ?, ?, ?)`,
      [
        organizationId,
        actorUserId,
        workDayId,
        workDayId,
        reason,
        JSON.stringify({ ...previousData, trips: tripRows }),
        JSON.stringify({ deleted: true }),
      ]
    );

    const [result] = await connection.query(
      `DELETE FROM work_days
       WHERE id = ? AND organization_id = ? AND driver_user_id = ?
         AND is_locked = 0`,
      [workDayId, organizationId, actorUserId]
    );

    if (result.affectedRows !== 1) {
      throw new Error("Jornada no encontrada o protegida");
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getAdjacentVehicleWorkDays = async (workDayId) => {
  const [rows] = await pool.query(
    `
    SELECT
      adjacent.id,
      adjacent.start_km AS startKm,
      adjacent.end_km AS endKm,
      CASE
        WHEN adjacent.date < current_day.date
          OR (
            adjacent.date = current_day.date
            AND (
              adjacent.created_at < current_day.created_at
              OR (
                adjacent.created_at = current_day.created_at
                AND adjacent.id < current_day.id
              )
            )
          )
        THEN 'PREVIOUS'
        ELSE 'NEXT'
      END AS position
    FROM work_days current_day
    INNER JOIN work_days adjacent
      ON adjacent.organization_id = current_day.organization_id
      AND adjacent.vehicle_id = current_day.vehicle_id
      AND adjacent.status = 'CLOSED'
      AND adjacent.id <> current_day.id
    WHERE current_day.id = ?
      AND (
        adjacent.date <> current_day.date
        OR adjacent.created_at <> current_day.created_at
        OR adjacent.id <> current_day.id
      )
    ORDER BY adjacent.date, adjacent.created_at, adjacent.id
    `,
    [workDayId]
  );

  const previousRows = rows.filter((row) => row.position === "PREVIOUS");
  const nextRows = rows.filter((row) => row.position === "NEXT");

  return {
    previous: previousRows.at(-1) || null,
    next: nextRows[0] || null,
  };
};

const getClosedWorkDayCorrectionContext = async (workDayId, date) => {
  const [duplicateRows] = await pool.query(
    `SELECT duplicate_day.id
     FROM work_days current_day
     INNER JOIN work_days duplicate_day
       ON duplicate_day.organization_id = current_day.organization_id
      AND duplicate_day.driver_user_id = current_day.driver_user_id
      AND duplicate_day.date = ?
      AND duplicate_day.id <> current_day.id
     WHERE current_day.id = ?
     LIMIT 1`,
    [date, workDayId]
  );

  const [vehicleRows] = await pool.query(
    `SELECT adjacent.id, adjacent.start_km AS startKm,
        adjacent.end_km AS endKm,
        CASE WHEN adjacent.date < ? OR (
          adjacent.date = ? AND (
            adjacent.created_at < current_day.created_at OR
            (adjacent.created_at = current_day.created_at AND adjacent.id < current_day.id)
          )
        ) THEN 'PREVIOUS' ELSE 'NEXT' END AS position
     FROM work_days current_day
     INNER JOIN work_days adjacent
       ON adjacent.organization_id = current_day.organization_id
      AND adjacent.vehicle_id = current_day.vehicle_id
      AND adjacent.status = 'CLOSED'
      AND adjacent.id <> current_day.id
     WHERE current_day.id = ?
       AND (adjacent.date < ? OR adjacent.date > ? OR (
         adjacent.date = ? AND (
           adjacent.created_at <> current_day.created_at OR adjacent.id <> current_day.id
         )
       ))
     ORDER BY adjacent.date, adjacent.created_at, adjacent.id`,
    [date, date, workDayId, date, date, date]
  );

  const previousRows = vehicleRows.filter((row) => row.position === "PREVIOUS");
  const nextRows = vehicleRows.filter((row) => row.position === "NEXT");

  return {
    hasDuplicateDriverDate: duplicateRows.length > 0,
    previous: previousRows.at(-1) || null,
    next: nextRows[0] || null,
  };
};

const updateClosedWorkDayWithAudit = async ({
  workDayId,
  organizationId,
  actorUserId,
  reason,
  previousData,
  correctedData,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      UPDATE work_days
      SET date = ?, start_km = ?, end_km = ?, fuel_own = ?, fuel_jose = ?
      WHERE id = ? AND organization_id = ? AND driver_user_id = ?
        AND status = 'CLOSED' AND is_locked = 0
      `,
      [
        correctedData.date,
        correctedData.startKm,
        correctedData.endKm,
        correctedData.fuelOwn,
        correctedData.fuelJose,
        workDayId,
        organizationId,
        actorUserId,
      ]
    );

    if (result.affectedRows !== 1) {
      throw new Error("Jornada no encontrada o protegida");
    }

    const resultingData = {
      ...previousData,
      ...correctedData,
    };

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
      VALUES (?, ?, ?, 'WORK_DAY', ?, 'UPDATE', ?, ?, ?)
      `,
      [
        organizationId,
        actorUserId,
        workDayId,
        workDayId,
        reason,
        JSON.stringify(previousData),
        JSON.stringify(resultingData),
      ]
    );

    await connection.commit();
    return resultingData;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
  deleteWorkDayWithAudit,
  getAdjacentVehicleWorkDays,
  getClosedWorkDayCorrectionContext,
  updateClosedWorkDayWithAudit,
};
