const pool = require("../config/database");

const getWorkDayWithTrips = async (workDayId) => {
  const [workDayRows] = await pool.query(
    `
    SELECT
      id,
      date,
      start_km AS startKm,
      end_km AS endKm,
      fuel_own AS fuelOwn,
      fuel_jose AS fuelJose
    FROM work_days
    WHERE id = ?
    `,
    [workDayId]
  );

  if (workDayRows.length === 0) {
    return null;
  }

  const [tripRows] = await pool.query(
    `
    SELECT
      id,
      amount,
      payment_type AS paymentType,
      commission,
      commission_company_name AS commissionCompanyName,
      commission_company_amount AS commissionCompanyAmount,
      tip,
      note
    FROM trips
    WHERE work_day_id = ?
    `,
    [workDayId]
  );

  const [importRows] = await pool.query(
    `
    SELECT
      cash,
      card,
      source
    FROM monthly_work_day_imports
    WHERE date = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [workDayRows[0].date]
  );

  const [settlementRows] = await pool.query(
    `SELECT
       net_revenue AS netRevenue,
       cash_retained AS cashRetained,
       fuel_cost AS fuelCost,
       social_security AS socialSecurity,
       driver_share_basis_points AS driverShareBasisPoints,
       distributable_base AS distributableBase,
       driver_share AS driverShare,
       owner_share AS ownerShare,
       reimbursable_fuel AS reimbursableFuel,
       driver_entitlement AS driverEntitlement,
       balance,
       balance_direction AS balanceDirection,
       (
         SELECT COALESCE(SUM(all_snapshots.balance), 0)
         FROM daily_settlement_snapshots AS all_snapshots
         WHERE all_snapshots.organization_id = current_snapshot.organization_id
           AND all_snapshots.driver_user_id = current_snapshot.driver_user_id
       ) AS pendingBalance
     FROM daily_settlement_snapshots AS current_snapshot
     WHERE current_snapshot.work_day_id = ?`,
    [workDayId]
  );

  return {
    workDay: workDayRows[0],
    trips: tripRows,
    importedSummary: importRows[0] || null,
    dailySettlementSnapshot: settlementRows[0] || null,
  };
};

module.exports = {
  getWorkDayWithTrips,
};
