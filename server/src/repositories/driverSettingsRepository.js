const pool = require("../config/database");

const getSettings = async (organizationId, userId) => {
  const [rows] = await pool.query(
    `SELECT fuel_calculation_mode AS fuelCalculationMode,
            fuel_rate_per_km AS fuelRatePerKm,
            daily_social_security AS dailySocialSecurity
     FROM organization_memberships
     WHERE organization_id = ? AND user_id = ? AND status = 'ACTIVE'`,
    [organizationId, userId]
  );
  return rows[0] || null;
};

const updateSettings = async (organizationId, userId, settings) => {
  await pool.query(
    `UPDATE organization_memberships
     SET fuel_calculation_mode = 'DISTANCE_RATE',
         fuel_rate_per_km = ?, daily_social_security = ?
     WHERE organization_id = ? AND user_id = ? AND status = 'ACTIVE'`,
    [settings.fuelRatePerKm, settings.dailySocialSecurity, organizationId, userId]
  );
  return getSettings(organizationId, userId);
};

const listCompanies = async (organizationId, userId) => {
  const [rows] = await pool.query(
    `SELECT id, name, commission_amount AS commissionAmount, status
     FROM commission_companies
     WHERE organization_id = ? AND driver_user_id = ?
     ORDER BY status = 'ACTIVE' DESC, name`,
    [organizationId, userId]
  );
  return rows;
};

const getActiveCompany = async (organizationId, userId, companyId) => {
  const [rows] = await pool.query(
    `SELECT id, name, commission_amount AS commissionAmount
     FROM commission_companies
     WHERE id = ? AND organization_id = ? AND driver_user_id = ? AND status = 'ACTIVE'`,
    [companyId, organizationId, userId]
  );
  return rows[0] || null;
};

const createCompany = async (organizationId, userId, company) => {
  const [result] = await pool.query(
    `INSERT INTO commission_companies
       (organization_id, driver_user_id, name, commission_amount)
     VALUES (?, ?, ?, ?)`,
    [organizationId, userId, company.name, company.commissionAmount]
  );
  return { id: result.insertId, ...company, status: "ACTIVE" };
};

const updateCompany = async (organizationId, userId, companyId, company) => {
  const [result] = await pool.query(
    `UPDATE commission_companies
     SET name = ?, commission_amount = ?, status = ?
     WHERE id = ? AND organization_id = ? AND driver_user_id = ?`,
    [company.name, company.commissionAmount, company.status, companyId, organizationId, userId]
  );
  return result.affectedRows === 1
    ? { id: Number(companyId), ...company }
    : null;
};

module.exports = { createCompany, getActiveCompany, getSettings, listCompanies, updateCompany, updateSettings };
