const pool = require("../config/database");
const {
  calculateDailySettlement,
} = require("../utils/dailySettlement");
const { getWorkDayById } = require("./workDayRepository");

const closeWorkDayWithDailySettlement = async ({
  workDayId,
  date,
  endKm,
  fuelOwn,
  fuelJose,
  organizationId,
  driverUserId,
  socialSecurity,
  driverShareBasisPoints,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [workDayRows] = await connection.query(
      `SELECT id FROM work_days
       WHERE id = ? AND organization_id = ? AND driver_user_id = ?
         AND status = 'OPEN'
       FOR UPDATE`,
      [workDayId, organizationId, driverUserId]
    );

    if (workDayRows.length !== 1) {
      throw new Error("La jornada ya no está disponible para cerrar");
    }

    const [financialRows] = await connection.query(
      `SELECT
         COALESCE(SUM(CASE WHEN payment_type = 'cash' THEN amount ELSE 0 END), 0)
           AS cashAmount,
         COALESCE(SUM(CASE WHEN payment_type = 'card' THEN amount ELSE 0 END), 0)
           AS cardAmount,
         COALESCE(SUM(CASE WHEN payment_type = 'cash' THEN commission ELSE 0 END), 0)
           AS cashCommission,
         COALESCE(SUM(CASE WHEN payment_type = 'card' THEN commission ELSE 0 END), 0)
           AS cardCommission,
         COALESCE(SUM(tip), 0) AS tip
       FROM trips
       WHERE work_day_id = ?`,
      [workDayId]
    );
    const financials = financialRows[0];
    const cashRetained = Number(financials.cashAmount)
      - Number(financials.cashCommission)
      - Number(financials.tip);
    const netRevenue = Number(financials.cashAmount)
      - Number(financials.cashCommission)
      - Number(financials.tip)
      + Number(financials.cardAmount)
      - Number(financials.cardCommission);
    const snapshot = calculateDailySettlement({
      netRevenue,
      cashRetained,
      fuelCost: fuelOwn,
      socialSecurity,
      driverShareBasisPoints,
    });

    await connection.query(
      `UPDATE work_days
       SET date = ?, end_km = ?, fuel_own = ?, fuel_jose = ?,
           status = 'CLOSED'
       WHERE id = ? AND organization_id = ? AND driver_user_id = ?
         AND status = 'OPEN'`,
      [
        date,
        endKm,
        fuelOwn,
        fuelJose,
        workDayId,
        organizationId,
        driverUserId,
      ]
    );

    await connection.query(
      `INSERT INTO daily_settlement_snapshots (
         work_day_id, organization_id, driver_user_id,
         net_revenue, cash_retained, fuel_cost, social_security,
         driver_share_basis_points, distributable_base, driver_share,
         owner_share, reimbursable_fuel, driver_entitlement,
         owner_adjustment, balance, balance_direction
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workDayId,
        organizationId,
        driverUserId,
        snapshot.netRevenue,
        snapshot.cashRetained,
        snapshot.fuelCost,
        snapshot.socialSecurity,
        driverShareBasisPoints,
        snapshot.distributableBase,
        snapshot.driverShare,
        snapshot.ownerShare,
        snapshot.reimbursableFuel,
        snapshot.driverEntitlement,
        snapshot.ownerAdjustment,
        snapshot.balance,
        snapshot.balanceDirection,
      ]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getWorkDayById(workDayId, {
    organizationId,
    userId: driverUserId,
    canReadOrganization: false,
  });
};

module.exports = {
  closeWorkDayWithDailySettlement,
};
