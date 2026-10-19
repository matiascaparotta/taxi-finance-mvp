const assert = require("node:assert/strict");
const test = require("node:test");
const {
  calculateDailyMonthlySettlement,
} = require("../src/utils/dailyMonthlySettlement");

const settlement = (overrides = {}) => ({
  netRevenue: 283.03,
  cashRetained: 105.3,
  fuelCost: 29.01,
  socialSecurity: 35,
  distributableBase: 219.02,
  driverShare: 109.51,
  ownerShare: 109.51,
  reimbursableFuel: 29.01,
  driverEntitlement: 138.52,
  ownerAdjustment: 0,
  balance: 33.22,
  pendingBalance: 23.22,
  payments: [],
  ...overrides,
});

test("suma las instantáneas diarias sin recalcular descuentos", () => {
  const result = calculateDailyMonthlySettlement({
    month: "2026-10",
    summaries: [
      { dailySettlement: settlement() },
      { dailySettlement: settlement({ balance: -10, pendingBalance: 46.44 }) },
    ],
  });

  assert.equal(result.workedDays, 2);
  assert.equal(result.netRevenue, 566.06);
  assert.equal(result.socialSecurity, 70);
  assert.equal(result.driverShare, 219.02);
  assert.equal(result.ownerAdjustment, 0);
  assert.equal(result.dailyBalance, 23.22);
  assert.equal(result.pendingBalance, 46.44);
});

test("separa pagos del mes y conserva el pendiente global", () => {
  const result = calculateDailyMonthlySettlement({
    month: "2026-10",
    summaries: [{
      dailySettlement: settlement({
        payments: [
          { direction: "OWNER_TO_DRIVER", amount: 20, paymentDate: "2026-10-10" },
          { direction: "DRIVER_TO_OWNER", amount: 5, paymentDate: "2026-10-12" },
          { direction: "OWNER_TO_DRIVER", amount: 7, paymentDate: "2026-09-30" },
        ],
      }),
    }],
  });

  assert.equal(result.paymentsReceived, 20);
  assert.equal(result.paymentsDelivered, 5);
  assert.equal(result.paymentCount, 2);
  assert.equal(result.pendingBalance, 23.22);
});
