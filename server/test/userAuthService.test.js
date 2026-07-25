const assert = require("node:assert/strict");
const test = require("node:test");

const {
  authenticateUser,
  normalizeUsername,
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
