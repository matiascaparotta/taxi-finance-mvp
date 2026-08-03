const roundMoney = (value) =>
  Number(Number(value || 0).toFixed(2));

const sum = (items, key) =>
  roundMoney(
    items.reduce((total, item) => total + Number(item[key] || 0), 0)
  );

const calculateMonthlySettlement = ({
  summaries = [],
  socialSecurity = 670,
  payrollTransfer = 1533.41,
  expectedWorkDays = 22,
  useProratedSocialSecurity = false,
}) => {
  const workedDays = summaries.length;
  const rawRevenue = sum(summaries, "totalRevenue");
  const cashGenerated = sum(summaries, "realCash");
  const cardGenerated = sum(summaries, "card");
  const fuelOwn = sum(summaries, "fuelOwn");
  const fuelJose = sum(summaries, "fuelJose");
  const workedKm = sum(summaries, "workedKm");
  const tripCount = summaries.reduce(
    (total, item) => total + Number(item.tripCount || 0),
    0
  );
  const safeExpectedDays = Math.max(1, Number(expectedWorkDays || 22));
  const monthlySocialSecurity = roundMoney(socialSecurity);
  const dailySocialSecurity = roundMoney(
    monthlySocialSecurity / safeExpectedDays
  );
  const socialSecurityApplied = useProratedSocialSecurity
    ? roundMoney(
        monthlySocialSecurity *
          (Math.min(workedDays, safeExpectedDays) / safeExpectedDays)
      )
    : monthlySocialSecurity;
  const netRevenueForSplit = roundMoney(rawRevenue - fuelOwn);
  const distributableBase = roundMoney(
    netRevenueForSplit - socialSecurityApplied
  );
  const driverHalf = roundMoney(distributableBase / 2);
  const ownerHalf = roundMoney(distributableBase - driverHalf);
  const pendingForDriver = roundMoney(
    driverHalf - Number(payrollTransfer || 0)
  );
  const cashAvailable = roundMoney(
    cashGenerated - fuelOwn - fuelJose
  );
  const deliveryToOwner = roundMoney(
    cashAvailable - pendingForDriver
  );
  const averageDailyRevenue = workedDays
    ? roundMoney(distributableBase / workedDays)
    : 0;

  return {
    workedDays,
    expectedWorkDays: safeExpectedDays,
    tripCount,
    workedKm,
    rawRevenue,
    cashGenerated,
    cardGenerated,
    fuelOwn,
    fuelJose,
    netRevenueForSplit,
    monthlySocialSecurity,
    dailySocialSecurity,
    socialSecurityApplied,
    distributableBase,
    driverHalf,
    ownerHalf,
    payrollTransfer: roundMoney(payrollTransfer),
    pendingForDriver,
    cashAvailable,
    deliveryToOwner,
    averageDailyRevenue,
    projectedNetRevenue: roundMoney(
      averageDailyRevenue * safeExpectedDays
    ),
  };
};

module.exports = {
  calculateMonthlySettlement,
  roundMoney,
};
