const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createDriverService,
  resetDriverPasswordService,
  updateDriverStatusService,
  validateDriverInput,
} = require("../src/services/driverManagementService");

test("valida carga real y tarifa por distancia", () => {
  assert.deepEqual(
    validateDriverInput({
      username: "  padre.caparotta ",
      displayName: " Padre Caparotta ",
      fuelCalculationMode: "ACTUAL_LOAD",
    }),
    {
      username: "padre.caparotta",
      displayName: "Padre Caparotta",
      fuelCalculationMode: "ACTUAL_LOAD",
      fuelRatePerKm: null,
    }
  );

  assert.equal(
    validateDriverInput({
      username: "padre.caparotta",
      displayName: "Padre Caparotta",
      fuelCalculationMode: "DISTANCE_RATE",
      fuelRatePerKm: "0.09",
    }).fuelRatePerKm,
    0.09
  );
});

test("crea un conductor con contraseña temporal de un solo uso", async () => {
  const state = { created: null };
  const repository = {
    async withTransaction(operation) {
      return operation({});
    },
    async findUserByUsername() {
      return null;
    },
    async createDriver(_connection, input) {
      state.created = input;
      return {
        id: 7,
        username: input.username,
        displayName: input.displayName,
        isOwner: false,
        fuelCalculationMode: input.fuelCalculationMode,
        fuelRatePerKm: input.fuelRatePerKm,
        status: "ACTIVE",
      };
    },
  };

  const result = await createDriverService(
    3,
    {
      username: "nuevo.conductor",
      displayName: "Nuevo Conductor",
      fuelCalculationMode: "ACTUAL_LOAD",
    },
    {
      repository,
      passwordGenerator: () => "temporal-segura-123",
      passwordHasher: (password) => `hash:${password}`,
    }
  );

  assert.equal(result.temporaryPassword, "temporal-segura-123");
  assert.equal(state.created.organizationId, 3);
  assert.equal(
    state.created.passwordHash,
    "hash:temporal-segura-123"
  );
  assert.equal(result.driver.id, 7);
});

test("rechaza nombres de usuario ya utilizados", async () => {
  const repository = {
    async withTransaction(operation) {
      return operation({});
    },
    async findUserByUsername() {
      return { id: 4 };
    },
  };

  await assert.rejects(
    () =>
      createDriverService(
        3,
        {
          username: "existente",
          displayName: "Conductor Existente",
        },
        { repository }
      ),
    /ya está en uso/
  );
});

test("impide suspender propietarios o conductores trabajando", async () => {
  const ownerRepository = {
    async findDriverMembership() {
      return { isOwner: true };
    },
  };
  await assert.rejects(
    () =>
      updateDriverStatusService(3, 4, "INACTIVE", {
        repository: ownerRepository,
      }),
    /cuenta propietaria/
  );

  const activeDriverRepository = {
    async findDriverMembership() {
      return { isOwner: false };
    },
    async hasOpenWorkDay() {
      return true;
    },
  };
  await assert.rejects(
    () =>
      updateDriverStatusService(3, 4, "INACTIVE", {
        repository: activeDriverRepository,
      }),
    /jornada activa/
  );
});

test("suspende y reactiva sin eliminar al conductor", async () => {
  let savedStatus = null;
  const repository = {
    async findDriverMembership() {
      return { isOwner: false };
    },
    async hasOpenWorkDay() {
      return false;
    },
    async updateDriverStatus(_organizationId, _userId, status) {
      savedStatus = status;
      return true;
    },
  };

  const result = await updateDriverStatusService(
    3,
    4,
    "INACTIVE",
    { repository }
  );

  assert.equal(savedStatus, "INACTIVE");
  assert.deepEqual(result, { id: 4, status: "INACTIVE" });
});

test("restablece la contraseña de un conductor no propietario", async () => {
  let savedHash = null;
  const repository = {
    async findDriverMembership() {
      return { isOwner: false };
    },
    async resetDriverPassword(_userId, passwordHash) {
      savedHash = passwordHash;
      return true;
    },
  };

  const result = await resetDriverPasswordService(3, 4, {
    repository,
    passwordGenerator: () => "nueva-temporal-456",
    passwordHasher: (password) => `hash:${password}`,
  });

  assert.equal(savedHash, "hash:nueva-temporal-456");
  assert.deepEqual(result, {
    id: 4,
    temporaryPassword: "nueva-temporal-456",
  });
});

test("impide restablecer contraseñas propietarias", async () => {
  await assert.rejects(
    () =>
      resetDriverPasswordService(3, 4, {
        repository: {
          async findDriverMembership() {
            return { isOwner: true };
          },
        },
      }),
    /contraseña propietaria/
  );
});
