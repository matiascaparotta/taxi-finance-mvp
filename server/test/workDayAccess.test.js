const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getReadScope,
  getWriteScope,
  canManageWorkDay,
} = require("../src/services/workDayAccess");

const driverAuth = {
  accessMode: "user",
  userId: 10,
  organizationId: 3,
  roles: { isOwner: false, isDriver: true },
};

const ownerAuth = {
  accessMode: "user",
  userId: 20,
  organizationId: 3,
  roles: { isOwner: true, isDriver: true },
};

test("un conductor solo obtiene alcance de lectura propio", () => {
  assert.deepEqual(getReadScope(driverAuth), {
    organizationId: 3,
    userId: 10,
    canReadOrganization: false,
  });
  assert.deepEqual(getWriteScope(driverAuth), {
    organizationId: 3,
    userId: 10,
  });
});

test("un propietario puede leer la organización pero escribe solo lo propio", () => {
  assert.deepEqual(getReadScope(ownerAuth), {
    organizationId: 3,
    userId: 20,
    canReadOrganization: true,
  });
  assert.deepEqual(getWriteScope(ownerAuth), {
    organizationId: 3,
    userId: 20,
  });

  assert.equal(
    canManageWorkDay(
      { organizationId: 3, driverUserId: 10 },
      ownerAuth
    ),
    false
  );
  assert.equal(
    canManageWorkDay(
      { organizationId: 3, driverUserId: 20 },
      ownerAuth
    ),
    true
  );
});

test("una sesión propietaria ya abierta conserva el alcance de organización", () => {
  assert.deepEqual(
    getReadScope({
      accessMode: "user",
      userId: 20,
      organizationId: 3,
      isOwner: true,
      isDriver: true,
    }),
    {
      organizationId: 3,
      userId: 20,
      canReadOrganization: true,
    }
  );
});

test("el acceso legado conserva el comportamiento actual", () => {
  assert.equal(getReadScope({ accessMode: "legacy" }), null);
  assert.equal(getWriteScope({ accessMode: "legacy" }), null);
  assert.equal(canManageWorkDay({}, { accessMode: "legacy" }), true);
});
