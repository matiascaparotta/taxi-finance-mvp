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

const findOrganizationBySlug = async (connection, slug) => {
  const [rows] = await connection.query(
    `
    SELECT id, name, slug
    FROM organizations
    WHERE slug = ?
    `,
    [slug]
  );

  return rows[0] || null;
};

const createOrganization = async (connection, { name, slug }) => {
  const [result] = await connection.query(
    `
    INSERT INTO organizations (name, slug)
    VALUES (?, ?)
    `,
    [name, slug]
  );

  return {
    id: result.insertId,
    name,
    slug,
  };
};

const findUserByUsername = async (connection, username) => {
  const [rows] = await connection.query(
    `
    SELECT
      id,
      username,
      display_name AS displayName
    FROM users
    WHERE username = ?
    `,
    [username]
  );

  return rows[0] || null;
};

const createUser = async (
  connection,
  { username, displayName, passwordHash }
) => {
  const [result] = await connection.query(
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

  return {
    id: result.insertId,
    username,
    displayName,
  };
};

const findMembership = async (
  connection,
  organizationId,
  userId
) => {
  const [rows] = await connection.query(
    `
    SELECT id
    FROM organization_memberships
    WHERE organization_id = ? AND user_id = ?
    `,
    [organizationId, userId]
  );

  return rows[0] || null;
};

const saveMembership = async (
  connection,
  {
    organizationId,
    userId,
    isOwner,
    isDriver,
    fuelCalculationMode,
    fuelRatePerKm,
    dailySocialSecurity,
  }
) => {
  const existing = await findMembership(
    connection,
    organizationId,
    userId
  );
  const values = [
    isOwner,
    isDriver,
    fuelCalculationMode,
    fuelRatePerKm,
    dailySocialSecurity,
  ];

  if (existing) {
    await connection.query(
      `
      UPDATE organization_memberships
      SET
        is_owner = ?,
        is_driver = ?,
        fuel_calculation_mode = ?,
        fuel_rate_per_km = ?,
        daily_social_security = ?,
        status = 'ACTIVE'
      WHERE id = ?
      `,
      [...values, existing.id]
    );

    return existing.id;
  }

  const [result] = await connection.query(
    `
    INSERT INTO organization_memberships (
      organization_id,
      user_id,
      is_owner,
      is_driver,
      fuel_calculation_mode,
      fuel_rate_per_km,
      daily_social_security
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [organizationId, userId, ...values]
  );

  return result.insertId;
};

const findVehicleByName = async (
  connection,
  organizationId,
  name
) => {
  const [rows] = await connection.query(
    `
    SELECT id, name, license_plate AS licensePlate
    FROM vehicles
    WHERE organization_id = ? AND name = ?
    `,
    [organizationId, name]
  );

  return rows[0] || null;
};

const createVehicle = async (
  connection,
  { organizationId, name, licensePlate }
) => {
  const [result] = await connection.query(
    `
    INSERT INTO vehicles (
      organization_id,
      name,
      license_plate
    )
    VALUES (?, ?, ?)
    `,
    [organizationId, name, licensePlate]
  );

  return {
    id: result.insertId,
    name,
    licensePlate,
  };
};

module.exports = {
  createOrganization,
  createUser,
  createVehicle,
  findOrganizationBySlug,
  findUserByUsername,
  findVehicleByName,
  saveMembership,
  withTransaction,
};
