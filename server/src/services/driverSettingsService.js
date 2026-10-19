const repository = require("../repositories/driverSettingsRepository");

const requireDailySettlementScope = (auth) => {
  const isDriver = Boolean(auth?.roles?.isDriver ?? auth?.isDriver);
  const isOwner = Boolean(auth?.roles?.isOwner ?? auth?.isOwner);
  if (auth?.accessMode !== "user" || auth?.settlementMode !== "DAILY_50_50" || !isDriver || isOwner) {
    throw new Error("Esta configuración pertenece al perfil asalariado");
  }
  return { organizationId: Number(auth.organizationId), userId: Number(auth.userId) };
};

const money = (value, label) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 10000) throw new Error(`${label} no es válido`);
  return Number(number.toFixed(2));
};

const rate = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > 10) throw new Error("La tarifa por kilómetro no es válida");
  return Number(number.toFixed(4));
};

const FUEL_MODES = new Set(["ACTUAL_LOAD", "DISTANCE_RATE"]);

const companyInput = (input) => {
  const name = input?.name?.trim();
  const commissionAmount = Number(input?.commissionAmount);
  if (!name || name.length > 120) throw new Error("El nombre de la empresa es obligatorio");
  if (!Number.isFinite(commissionAmount) || commissionAmount < 0 || commissionAmount > 10000) throw new Error("El importe de comisión no es válido");
  return { name, commissionAmount: Number(commissionAmount.toFixed(2)) };
};

const getDriverSettings = async (auth) => {
  const scope = requireDailySettlementScope(auth);
  const [settings, companies] = await Promise.all([
    repository.getSettings(scope.organizationId, scope.userId),
    repository.listCompanies(scope.organizationId, scope.userId),
  ]);
  return {
    fuelCalculationMode: settings?.fuelCalculationMode || "ACTUAL_LOAD",
    fuelRatePerKm: Number(settings?.fuelRatePerKm || 0),
    dailySocialSecurity: Number(settings?.dailySocialSecurity || 0),
    companies: companies.map((company) => ({ ...company, id: Number(company.id), commissionAmount: Number(company.commissionAmount) })),
  };
};

const updateDriverSettings = async (input, auth) => {
  const scope = requireDailySettlementScope(auth);
  const fuelCalculationMode = input?.fuelCalculationMode || "ACTUAL_LOAD";
  if (!FUEL_MODES.has(fuelCalculationMode)) {
    throw new Error("El modo de combustible no es válido");
  }
  return repository.updateSettings(scope.organizationId, scope.userId, {
    fuelCalculationMode,
    fuelRatePerKm:
      fuelCalculationMode === "DISTANCE_RATE"
        ? rate(input?.fuelRatePerKm)
        : Number(input?.fuelRatePerKm || 0),
    dailySocialSecurity: money(input?.dailySocialSecurity, "La Seguridad Social diaria"),
  });
};

const createCompany = async (input, auth) => {
  const scope = requireDailySettlementScope(auth);
  return repository.createCompany(scope.organizationId, scope.userId, companyInput(input));
};

const updateCompany = async (companyId, input, auth) => {
  const scope = requireDailySettlementScope(auth);
  const status = input?.status || "ACTIVE";
  if (!['ACTIVE', 'INACTIVE'].includes(status)) throw new Error("El estado de la empresa no es válido");
  const updated = await repository.updateCompany(scope.organizationId, scope.userId, companyId, { ...companyInput(input), status });
  if (!updated) throw new Error("Empresa no encontrada");
  return updated;
};

const deleteCompany = async (companyId, auth) => {
  const scope = requireDailySettlementScope(auth);
  const deleted = await repository.deleteCompany(scope.organizationId, scope.userId, companyId);
  if (!deleted) throw new Error("Empresa no encontrada");
  return { id: Number(companyId) };
};

module.exports = { createCompany, deleteCompany, getDriverSettings, requireDailySettlementScope, updateCompany, updateDriverSettings };
