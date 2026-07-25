const crypto = require("node:crypto");

const organizationSetupRepository = require(
  "../repositories/organizationSetupRepository"
);
const { hashPassword } = require("./authService");

const USERNAME_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const FUEL_MODES = new Set(["ACTUAL_LOAD", "DISTANCE_RATE"]);

const generateTemporaryPassword = () =>
  crypto.randomBytes(18).toString("base64url");

const validateSetup = ({ organization, users, vehicle }) => {
  if (!organization?.name?.trim() || !organization?.slug?.trim()) {
    throw new Error("La organización necesita nombre y slug");
  }

  if (!vehicle?.name?.trim()) {
    throw new Error("El vehículo necesita un nombre");
  }

  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Debe existir al menos un usuario");
  }

  const usernames = new Set();

  for (const user of users) {
    if (
      typeof user.username !== "string" ||
      !USERNAME_PATTERN.test(user.username) ||
      !user.displayName?.trim()
    ) {
      throw new Error(`Usuario inválido: ${user.username || "sin usuario"}`);
    }

    if (usernames.has(user.username)) {
      throw new Error(`Usuario duplicado: ${user.username}`);
    }

    if (!user.isOwner && !user.isDriver) {
      throw new Error(
        `${user.username} debe ser propietario, conductor o ambos`
      );
    }

    if (!FUEL_MODES.has(user.fuelCalculationMode)) {
      throw new Error(
        `Modalidad de combustible inválida para ${user.username}`
      );
    }

    if (
      user.fuelCalculationMode === "DISTANCE_RATE" &&
      !(Number(user.fuelRatePerKm) > 0)
    ) {
      throw new Error(
        `La tarifa por kilómetro de ${user.username} debe ser positiva`
      );
    }

    usernames.add(user.username);
  }

  if (!users.some((user) => user.isOwner)) {
    throw new Error("La organización necesita al menos un propietario");
  }
};

const provisionOrganization = async (
  setup,
  {
    repository = organizationSetupRepository,
    passwordHasher = hashPassword,
    passwordGenerator = generateTemporaryPassword,
  } = {}
) => {
  validateSetup(setup);

  return repository.withTransaction(async (connection) => {
    let organization = await repository.findOrganizationBySlug(
      connection,
      setup.organization.slug
    );

    if (
      organization &&
      organization.name !== setup.organization.name
    ) {
      throw new Error(
        `El slug ${setup.organization.slug} pertenece a otra organización`
      );
    }

    if (!organization) {
      organization = await repository.createOrganization(
        connection,
        setup.organization
      );
    }

    const provisionedUsers = [];

    for (const userSetup of setup.users) {
      let user = await repository.findUserByUsername(
        connection,
        userSetup.username
      );
      let temporaryPassword = null;

      if (user && user.displayName !== userSetup.displayName) {
        throw new Error(
          `El usuario ${userSetup.username} pertenece a otra persona`
        );
      }

      if (!user) {
        temporaryPassword = passwordGenerator();
        user = await repository.createUser(connection, {
          username: userSetup.username,
          displayName: userSetup.displayName,
          passwordHash: passwordHasher(temporaryPassword),
        });
      }

      await repository.saveMembership(connection, {
        organizationId: organization.id,
        userId: user.id,
        isOwner: userSetup.isOwner,
        isDriver: userSetup.isDriver,
        fuelCalculationMode: userSetup.fuelCalculationMode,
        fuelRatePerKm: userSetup.fuelRatePerKm ?? null,
      });

      provisionedUsers.push({
        username: user.username,
        displayName: user.displayName,
        created: temporaryPassword !== null,
        temporaryPassword,
      });
    }

    let vehicle = await repository.findVehicleByName(
      connection,
      organization.id,
      setup.vehicle.name
    );

    if (!vehicle) {
      vehicle = await repository.createVehicle(connection, {
        organizationId: organization.id,
        name: setup.vehicle.name,
        licensePlate: setup.vehicle.licensePlate ?? null,
      });
    }

    return {
      organization,
      users: provisionedUsers,
      vehicle,
    };
  });
};

module.exports = {
  generateTemporaryPassword,
  provisionOrganization,
  validateSetup,
};
