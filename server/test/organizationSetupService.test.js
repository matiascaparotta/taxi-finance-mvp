const assert = require("node:assert/strict");
const test = require("node:test");

const {
  provisionOrganization,
  validateSetup,
} = require("../src/services/organizationSetupService");
const {
  LIC249_SETUP,
} = require("../src/scripts/provisionLic249");
const {
  LIC1315_SETUP,
} = require("../src/scripts/provisionLic1315");

const createFakeRepository = () => {
  const state = {
    memberships: [],
    organizations: [],
    users: [],
    vehicles: [],
  };
  let nextId = 1;

  return {
    state,
    async withTransaction(operation) {
      return operation({});
    },
    async findOrganizationBySlug(_connection, slug) {
      return (
        state.organizations.find(
          (organization) => organization.slug === slug
        ) || null
      );
    },
    async createOrganization(_connection, organization) {
      const created = { id: nextId++, ...organization };
      state.organizations.push(created);
      return created;
    },
    async findUserByUsername(_connection, username) {
      return (
        state.users.find((user) => user.username === username) || null
      );
    },
    async createUser(_connection, user) {
      const created = {
        id: nextId++,
        username: user.username,
        displayName: user.displayName,
        passwordHash: user.passwordHash,
      };
      state.users.push(created);
      return created;
    },
    async saveMembership(_connection, membership) {
      const existing = state.memberships.find(
        (item) =>
          item.organizationId === membership.organizationId &&
          item.userId === membership.userId
      );

      if (existing) {
        Object.assign(existing, membership);
        return existing.id;
      }

      const created = { id: nextId++, ...membership };
      state.memberships.push(created);
      return created.id;
    },
    async findVehicleByName(_connection, organizationId, name) {
      return (
        state.vehicles.find(
          (vehicle) =>
            vehicle.organizationId === organizationId &&
            vehicle.name === name
        ) || null
      );
    },
    async createVehicle(_connection, vehicle) {
      const created = { id: nextId++, ...vehicle };
      state.vehicles.push(created);
      return created;
    },
  };
};

test("prepara Lic249 con Matías, José y el vehículo compartido", async () => {
  const repository = createFakeRepository();
  const passwords = ["temporal-matias", "temporal-jose"];
  const result = await provisionOrganization(LIC249_SETUP, {
    repository,
    passwordGenerator: () => passwords.shift(),
    passwordHasher: (password) => `hash:${password}`,
  });

  assert.equal(result.organization.name, "Lic249");
  assert.equal(result.vehicle.name, "Taxi Lic249");
  assert.deepEqual(
    result.users.map((user) => user.username),
    ["mati.caparotta", "jose.revilla"]
  );
  assert.deepEqual(
    result.users.map((user) => user.temporaryPassword),
    ["temporal-matias", "temporal-jose"]
  );

  const matias = repository.state.users.find(
    (user) => user.username === "mati.caparotta"
  );
  const jose = repository.state.users.find(
    (user) => user.username === "jose.revilla"
  );
  const matiasMembership = repository.state.memberships.find(
    (membership) => membership.userId === matias.id
  );
  const joseMembership = repository.state.memberships.find(
    (membership) => membership.userId === jose.id
  );

  assert.equal(matiasMembership.isOwner, false);
  assert.equal(matiasMembership.isDriver, true);
  assert.equal(matiasMembership.settlementMode, "MONTHLY_50_50");
  assert.equal(matiasMembership.driverShareBasisPoints, 5000);
  assert.equal(joseMembership.isOwner, true);
  assert.equal(joseMembership.isDriver, true);
  assert.equal(joseMembership.settlementMode, "NONE");
});

test("prepara Lic1315 con David como propietario y Alberto como conductor", async () => {
  const repository = createFakeRepository();
  const passwords = ["temporal-david", "temporal-alberto"];
  const result = await provisionOrganization(LIC1315_SETUP, {
    repository,
    passwordGenerator: () => passwords.shift(),
    passwordHasher: (password) => `hash:${password}`,
  });

  assert.equal(result.organization.name, "Lic1315");
  assert.equal(result.organization.slug, "lic1315");
  assert.equal(result.vehicle.name, "Taxi Lic1315");
  assert.deepEqual(
    result.users.map((user) => user.username),
    ["david.jurado", "alberto.caparotta"]
  );

  const david = repository.state.users.find(
    (user) => user.username === "david.jurado"
  );
  const alberto = repository.state.users.find(
    (user) => user.username === "alberto.caparotta"
  );
  const davidMembership = repository.state.memberships.find(
    (membership) => membership.userId === david.id
  );
  const membership = repository.state.memberships.find(
    (item) => item.userId === alberto.id
  );

  assert.equal(davidMembership.isOwner, true);
  assert.equal(davidMembership.isDriver, false);
  assert.equal(davidMembership.settlementMode, "NONE");

  assert.equal(membership.userId, alberto.id);
  assert.equal(membership.isOwner, false);
  assert.equal(membership.isDriver, true);
  assert.equal(membership.fuelCalculationMode, "ACTUAL_LOAD");
  assert.equal(membership.fuelRatePerKm, null);
  assert.equal(membership.dailySocialSecurity, 35);
  assert.equal(membership.settlementMode, "DAILY_50_50");
  assert.equal(membership.driverShareBasisPoints, 5000);
});

test("puede repetirse sin duplicar ni cambiar contraseñas", async () => {
  const repository = createFakeRepository();
  let generatedPasswords = 0;
  const dependencies = {
    repository,
    passwordGenerator: () => {
      generatedPasswords += 1;
      return `temporal-${generatedPasswords}`;
    },
    passwordHasher: (password) => `hash:${password}`,
  };

  await provisionOrganization(LIC249_SETUP, dependencies);
  const secondResult = await provisionOrganization(
    LIC249_SETUP,
    dependencies
  );

  assert.equal(generatedPasswords, 2);
  assert.equal(repository.state.organizations.length, 1);
  assert.equal(repository.state.users.length, 2);
  assert.equal(repository.state.memberships.length, 2);
  assert.equal(repository.state.vehicles.length, 1);
  assert.ok(
    secondResult.users.every(
      (user) => !user.created && user.temporaryPassword === null
    )
  );
});

test("exige tarifa positiva para combustible por distancia", () => {
  const setup = structuredClone(LIC249_SETUP);
  setup.users[0].fuelCalculationMode = "DISTANCE_RATE";
  setup.users[0].fuelRatePerKm = 0;

  assert.throws(
    () => validateSetup(setup),
    /tarifa por kilómetro/
  );
});

test("exige al menos un propietario en la organización", () => {
  const setup = structuredClone(LIC249_SETUP);
  setup.users.forEach((user) => {
    user.isOwner = false;
  });

  assert.throws(
    () => validateSetup(setup),
    /al menos un propietario/
  );
});

test("exige un porcentaje válido para una liquidación configurada", () => {
  const setup = structuredClone(LIC1315_SETUP);
  const alberto = setup.users.find(
    (user) => user.username === "alberto.caparotta"
  );
  alberto.driverShareBasisPoints = 0;

  assert.throws(
    () => validateSetup(setup),
    /Porcentaje de reparto/
  );
});
