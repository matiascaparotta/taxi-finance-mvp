const assert = require("node:assert/strict");
const test = require("node:test");

const {
  authorizeClosedWorkDayCorrection,
  normalizeCorrectionReason,
} = require("../src/services/closedWorkDayCorrectionService");

const auth = {
  accessMode: "user",
  userId: 2,
  organizationId: 1,
};

test("autoriza una corrección con contraseña y motivo válidos", async () => {
  const result = await authorizeClosedWorkDayCorrection(
    {
      auth,
      password: "Clave123",
      reason: " Importe incorrecto ",
    },
    {
      repository: {
        async findActiveUserForPasswordChange(userId) {
          assert.equal(userId, 2);
          return { passwordHash: "hash-seguro" };
        },
      },
      passwordVerifier: (password, hash) =>
        password === "Clave123" && hash === "hash-seguro",
    }
  );

  assert.deepEqual(result, {
    actorUserId: 2,
    organizationId: 1,
    reason: "Importe incorrecto",
  });
});

test("rechaza una contraseña incorrecta", async () => {
  await assert.rejects(
    authorizeClosedWorkDayCorrection(
      {
        auth,
        password: "Incorrecta",
        reason: "Importe incorrecto",
      },
      {
        repository: {
          async findActiveUserForPasswordChange() {
            return { passwordHash: "hash-seguro" };
          },
        },
        passwordVerifier: () => false,
      }
    ),
    /contraseña actual es incorrecta/
  );
});

test("exige cuenta personal y un motivo concreto", async () => {
  await assert.rejects(
    authorizeClosedWorkDayCorrection({
      auth: { accessMode: "legacy" },
      password: "Clave123",
      reason: "Importe incorrecto",
    }),
    /cuenta personal/
  );
  assert.throws(
    () => normalizeCorrectionReason("mal"),
    /al menos 5 caracteres/
  );
});
