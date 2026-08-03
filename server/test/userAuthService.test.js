const assert = require("node:assert/strict");
const test = require("node:test");

const {
  authenticateUser,
  changeUserPassword,
  normalizeUsername,
  validateNewPassword,
} = require("../src/services/userAuthService");

const activeUser = {
  userId: 2,
  username: "mati.caparotta",
  displayName: "Matías Caparotta",
  passwordHash: "hash-seguro",
  mustChangePassword: 1,
  organizationId: 1,
  organizationName: "Lic249",
  isOwner: 0,
  isDriver: 1,
};

test("normaliza el nombre de usuario", () => {
  assert.equal(
    normalizeUsername("  Mati.Caparotta "),
    "mati.caparotta"
  );
});

test("autentica una cuenta activa y devuelve datos públicos", async () => {
  const requestedUsernames = [];
  const user = await authenticateUser(
    {
      username: " Mati.Caparotta ",
      password: "clave-correcta",
    },
    {
      repository: {
        async findActiveUserForLogin(username) {
          requestedUsernames.push(username);
          return activeUser;
        },
      },
      passwordVerifier: (password, hash) =>
        password === "clave-correcta" &&
        hash === activeUser.passwordHash,
    }
  );

  assert.deepEqual(requestedUsernames, ["mati.caparotta"]);
  assert.deepEqual(user, {
    userId: 2,
    username: "mati.caparotta",
    displayName: "Matías Caparotta",
    organizationId: 1,
    organizationName: "Lic249",
    isOwner: false,
    isDriver: true,
    fuelCalculationMode: "ACTUAL_LOAD",
    fuelRatePerKm: null,
    mustChangePassword: true,
  });
  assert.equal("passwordHash" in user, false);
});

test("rechaza una contraseña individual incorrecta", async () => {
  const user = await authenticateUser(
    {
      username: "mati.caparotta",
      password: "incorrecta",
    },
    {
      repository: {
        async findActiveUserForLogin() {
          return activeUser;
        },
      },
      passwordVerifier: () => false,
    }
  );

  assert.equal(user, null);
});

test("rechaza credenciales incompletas sin consultar la base", async () => {
  let repositoryCalls = 0;
  const user = await authenticateUser(
    {
      username: "",
      password: "clave",
    },
    {
      repository: {
        async findActiveUserForLogin() {
          repositoryCalls += 1;
          return activeUser;
        },
      },
    }
  );

  assert.equal(user, null);
  assert.equal(repositoryCalls, 0);
});

test("exige una contraseña nueva suficientemente segura", () => {
  assert.throws(
    () => validateNewPassword("corta1"),
    /al menos 10/
  );
  assert.throws(
    () => validateNewPassword("sololetrass"),
    /letra y un número/
  );
});

test("cambia la contraseña actual de forma atómica", async () => {
  const updates = [];
  const result = await changeUserPassword(
    {
      userId: 2,
      currentPassword: "Temporal123",
      newPassword: "Personal456",
    },
    {
      repository: {
        async findActiveUserForPasswordChange() {
          return {
            userId: 2,
            passwordHash: "hash-temporal",
          };
        },
        async updatePassword(userId, currentHash, newHash) {
          updates.push({ userId, currentHash, newHash });
          return true;
        },
      },
      passwordVerifier: (password, hash) =>
        password === "Temporal123" && hash === "hash-temporal",
      passwordHasher: (password) => `hash:${password}`,
    }
  );

  assert.deepEqual(result, {
    userId: 2,
    mustChangePassword: false,
  });
  assert.deepEqual(updates, [
    {
      userId: 2,
      currentHash: "hash-temporal",
      newHash: "hash:Personal456",
    },
  ]);
});

test("rechaza una contraseña actual incorrecta", async () => {
  await assert.rejects(
    changeUserPassword(
      {
        userId: 2,
        currentPassword: "Incorrecta123",
        newPassword: "Personal456",
      },
      {
        repository: {
          async findActiveUserForPasswordChange() {
            return {
              userId: 2,
              passwordHash: "hash-temporal",
            };
          },
        },
        passwordVerifier: () => false,
      }
    ),
    /actual es incorrecta/
  );
});
