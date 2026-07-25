const driverManagementRepository = require(
  "../repositories/driverManagementRepository"
);
const {
  generateTemporaryPassword,
} = require("./organizationSetupService");
const { hashPassword } = require("./authService");
const { normalizeUsername } = require("./userAuthService");

const USERNAME_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const DRIVER_STATUSES = new Set(["ACTIVE", "INACTIVE"]);
const FUEL_MODES = new Set(["ACTUAL_LOAD", "DISTANCE_RATE"]);

const serializeDriver = (driver) => ({
  ...driver,
  id: Number(driver.id),
  isOwner: Boolean(driver.isOwner),
  fuelRatePerKm:
    driver.fuelRatePerKm === null
      ? null
      : Number(driver.fuelRatePerKm),
});

const validateDriverInput = (input) => {
  const username = normalizeUsername(input?.username);
  const displayName = input?.displayName?.trim();
  const fuelCalculationMode =
    input?.fuelCalculationMode || "ACTUAL_LOAD";
  const fuelRatePerKm =
    fuelCalculationMode === "DISTANCE_RATE"
      ? Number(input?.fuelRatePerKm)
      : null;

  if (!USERNAME_PATTERN.test(username)) {
    throw new Error(
      "El usuario solo puede incluir letras minúsculas, números, puntos, guiones y guiones bajos"
    );
  }

  if (!displayName || displayName.length > 120) {
    throw new Error("El nombre del conductor es obligatorio");
  }

  if (!FUEL_MODES.has(fuelCalculationMode)) {
    throw new Error("La modalidad de combustible no es válida");
  }

  if (
    fuelCalculationMode === "DISTANCE_RATE" &&
    !(fuelRatePerKm > 0)
  ) {
    throw new Error("La tarifa por kilómetro debe ser positiva");
  }

  return {
    username,
    displayName,
    fuelCalculationMode,
    fuelRatePerKm,
  };
};

const listDriversService = async (
  organizationId,
  { repository = driverManagementRepository } = {}
) => {
  const drivers = await repository.listDrivers(organizationId);
  return drivers.map(serializeDriver);
};

const createDriverService = async (
  organizationId,
  input,
  {
    repository = driverManagementRepository,
    passwordGenerator = generateTemporaryPassword,
    passwordHasher = hashPassword,
  } = {}
) => {
  const driverInput = validateDriverInput(input);

  return repository.withTransaction(async (connection) => {
    const existing = await repository.findUserByUsername(
      connection,
      driverInput.username
    );

    if (existing) {
      throw new Error("Ese nombre de usuario ya está en uso");
    }

    const temporaryPassword = passwordGenerator();
    const driver = await repository.createDriver(connection, {
      organizationId,
      ...driverInput,
      passwordHash: passwordHasher(temporaryPassword),
    });

    return {
      driver: serializeDriver(driver),
      temporaryPassword,
    };
  });
};

const updateDriverStatusService = async (
  organizationId,
  userId,
  status,
  { repository = driverManagementRepository } = {}
) => {
  if (!DRIVER_STATUSES.has(status)) {
    throw new Error("El estado del conductor no es válido");
  }

  const membership = await repository.findDriverMembership(
    organizationId,
    userId
  );

  if (!membership) {
    throw new Error("Conductor no encontrado");
  }

  if (membership.isOwner) {
    throw new Error("No se puede suspender una cuenta propietaria");
  }

  if (
    status === "INACTIVE" &&
    (await repository.hasOpenWorkDay(organizationId, userId))
  ) {
    throw new Error(
      "No se puede suspender al conductor mientras tenga una jornada activa"
    );
  }

  const updated = await repository.updateDriverStatus(
    organizationId,
    userId,
    status
  );

  if (!updated) {
    throw new Error("No se pudo actualizar el conductor");
  }

  return {
    id: Number(userId),
    status,
  };
};

module.exports = {
  createDriverService,
  listDriversService,
  updateDriverStatusService,
  validateDriverInput,
};
