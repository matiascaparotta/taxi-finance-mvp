const repository = require("../repositories/monthlySettlementRepository");
const { getWorkDaySummaryService } = require("./workDaySummaryService");
const {
  calculateMonthlySettlement,
} = require("../utils/monthlySettlement");

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DEFAULTS = {
  expectedWorkDays: 22,
  socialSecurity: 670,
  payrollTransfer: 1533.41,
};

const isOwner = (auth) => Boolean(auth?.roles?.isOwner ?? auth?.isOwner);

const requirePersonalAccess = (auth) => {
  if (auth?.accessMode !== "user") {
    throw new Error("La liquidación mensual requiere una cuenta personal");
  }
};

const validateMonth = (month) => {
  if (!MONTH_PATTERN.test(month || "")) {
    throw new Error("El mes debe tener el formato AAAA-MM");
  }
};

const resolveDriver = async (auth, requestedDriverId) => {
  requirePersonalAccess(auth);
  const driverUserId = requestedDriverId
    ? Number(requestedDriverId)
    : Number(auth.userId);
  if (driverUserId !== Number(auth.userId) && !isOwner(auth)) {
    throw new Error("No tienes acceso a esa liquidación");
  }
  const driver = await repository.getDriver(
    Number(auth.organizationId),
    driverUserId
  );
  if (!driver?.isDriver) {
    throw new Error("Conductor no encontrado");
  }
  return { ...driver, id: Number(driver.id) };
};

const monthIsCurrent = (month, now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year").value;
  const monthPart = parts.find((part) => part.type === "month").value;
  return month === `${year}-${monthPart}`;
};

const buildMonthlySettlement = async (month, auth, requestedDriverId) => {
  validateMonth(month);
  const driver = await resolveDriver(auth, requestedDriverId);
  const organizationId = Number(auth.organizationId);
  const [record, workDays] = await Promise.all([
    repository.getSettlement(organizationId, driver.id, month),
    repository.getClosedWorkDays(organizationId, driver.id, month),
  ]);
  if (record?.status === "CLOSED" && record.closedSnapshot) {
    const snapshot =
      typeof record.closedSnapshot === "string"
        ? JSON.parse(record.closedSnapshot)
        : record.closedSnapshot;
    return {
      ...snapshot,
      status: "CLOSED",
      closedAt: record.closedAt,
      canEditSettings: false,
      canClose: false,
    };
  }
  const summaries = await Promise.all(
    workDays.map((workDay) => getWorkDaySummaryService(workDay.id, auth))
  );
  const settings = {
    expectedWorkDays: Number(record?.expectedWorkDays ?? DEFAULTS.expectedWorkDays),
    socialSecurity: Number(record?.socialSecurity ?? DEFAULTS.socialSecurity),
    payrollTransfer: Number(record?.payrollTransfer ?? DEFAULTS.payrollTransfer),
    settingsConfirmed: Boolean(record?.settingsConfirmed),
  };
  const current = monthIsCurrent(month);
  const calculation = calculateMonthlySettlement({
    summaries,
    ...settings,
    useProratedSocialSecurity: current,
  });
  const commissionByCompany = Object.values(summaries.reduce((groups, summary) => {
    for (const item of summary.commissionByCompany || []) {
      groups[item.name] ||= { name: item.name, amount: 0, tripCount: 0 };
      groups[item.name].amount += Number(item.amount || 0);
      groups[item.name].tripCount += Number(item.tripCount || 0);
    }
    return groups;
  }, {})).map((item) => ({ ...item, amount: Number(item.amount.toFixed(2)) }));
  const salariedMetrics = {
    commission: Number(summaries.reduce((total, item) => total + Number(item.commission || 0), 0).toFixed(2)),
    tip: Number(summaries.reduce((total, item) => total + Number(item.tip || 0), 0).toFixed(2)),
    commissionByCompany,
  };
  return {
    month,
    driver: { id: driver.id, displayName: driver.displayName },
    settings,
    calculation,
    salariedMetrics,
    days: summaries.map((summary) => ({
      workDayId: summary.workDayId,
      date: summary.date,
      totalRevenue: summary.totalRevenue,
      fuelOwn: summary.fuelOwn,
      fuelJose: summary.fuelJose,
      netRevenue: Number((summary.totalRevenue - summary.fuelOwn).toFixed(2)),
      cash: summary.realCash,
      card: summary.card,
      tripCount: summary.tripCount,
    })),
    status: current ? "IN_PROGRESS" : workDays.length ? "PENDING_REVIEW" : "EMPTY",
    canEditSettings: true,
    canClose:
      Number(auth.userId) === driver.id &&
      !current &&
      settings.settingsConfirmed &&
      workDays.length > 0,
  };
};

const listMonthlySettlements = async (year, auth, driverUserId) => {
  if (!/^\d{4}$/.test(String(year || ""))) {
    throw new Error("El año no es válido");
  }
  const driver = await resolveDriver(auth, driverUserId);
  const months = await repository.getAvailableMonths(
    Number(auth.organizationId),
    driver.id,
    Number(year)
  );
  return Promise.all(
    months.map((month) => buildMonthlySettlement(month, auth, driver.id))
  );
};

const updateMonthlySettings = async (month, input, auth, driverUserId) => {
  validateMonth(month);
  const driver = await resolveDriver(auth, driverUserId);
  const existing = await repository.getSettlement(
    Number(auth.organizationId), driver.id, month
  );
  if (existing?.status === "CLOSED") {
    throw new Error("Una liquidación cerrada no puede modificarse");
  }
  const expectedWorkDays = Number(input.expectedWorkDays);
  const socialSecurity = Number(input.socialSecurity);
  const payrollTransfer = Number(input.payrollTransfer);
  const settingsConfirmed = input.settingsConfirmed === true;
  if (!Number.isInteger(expectedWorkDays) || expectedWorkDays < 1 || expectedWorkDays > 31) {
    throw new Error("Los días laborables deben estar entre 1 y 31");
  }
  if (socialSecurity < 0 || payrollTransfer < 0 || !Number.isFinite(socialSecurity + payrollTransfer)) {
    throw new Error("Los importes mensuales no son válidos");
  }
  await repository.saveSettings({
    organizationId: Number(auth.organizationId),
    driverUserId: driver.id,
    month,
    expectedWorkDays,
    socialSecurity,
    payrollTransfer,
    settingsConfirmed,
    actorUserId: Number(auth.userId),
  });
  return buildMonthlySettlement(month, auth, driver.id);
};

const closeMonthlySettlement = async (month, input, auth) => {
  validateMonth(month);
  const driver = await resolveDriver(auth, input?.driverUserId);
  if (Number(auth.userId) !== driver.id) {
    throw new Error("Solo el conductor puede cerrar su liquidación");
  }
  if (input?.confirmation !== "CERRAR") {
    throw new Error("Escribe CERRAR para confirmar");
  }
  const result = await buildMonthlySettlement(month, auth, driver.id);
  if (!result.canClose) {
    throw new Error("Revisa y confirma primero los datos mensuales");
  }
  const snapshot = { ...result, status: "CLOSED", canEditSettings: false, canClose: false };
  await repository.closeSettlement({
    organizationId: Number(auth.organizationId),
    driverUserId: driver.id,
    month,
    actorUserId: Number(auth.userId),
    snapshot,
  });
  return buildMonthlySettlement(month, auth, driver.id);
};

module.exports = {
  buildMonthlySettlement,
  closeMonthlySettlement,
  listMonthlySettlements,
  monthIsCurrent,
  updateMonthlySettings,
};
