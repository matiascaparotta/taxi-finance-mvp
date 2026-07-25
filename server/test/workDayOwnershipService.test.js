const assert = require("node:assert/strict");
const test = require("node:test");

const {
  assignExistingWorkDays,
} = require("../src/services/workDayOwnershipService");
const {
  MATIAS_ASSIGNMENT,
} = require("../src/scripts/assignWorkDaysToMatias");

const TARGET = {
  organizationId: 1,
  userId: 2,
  vehicleId: 3,
};

const createFakeRepository = (workDays, target = TARGET) => ({
  workDays,
  async withTransaction(operation) {
    return operation({});
  },
  async findAssignmentTarget() {
    return target;
  },
  async lockWorkDays() {},
  async getOwnershipStats(_connection, expectedTarget) {
    const isUnassigned = (workDay) =>
      workDay.organizationId === null &&
      workDay.userId === null &&
      workDay.vehicleId === null;
    const isPartial = (workDay) => {
      const present = [
        workDay.organizationId,
        workDay.userId,
        workDay.vehicleId,
      ].filter((value) => value !== null).length;

      return present > 0 && present < 3;
    };
    const isTarget = (workDay) =>
      workDay.organizationId === expectedTarget.organizationId &&
      workDay.userId === expectedTarget.userId &&
      workDay.vehicleId === expectedTarget.vehicleId;
    const isElsewhere = (workDay) =>
      !isUnassigned(workDay) &&
      !isPartial(workDay) &&
      !isTarget(workDay);

    return {
      total: workDays.length,
      unassigned: workDays.filter(isUnassigned).length,
      partial: workDays.filter(isPartial).length,
      assignedToTarget: workDays.filter(isTarget).length,
      assignedElsewhere: workDays.filter(isElsewhere).length,
    };
  },
  async assignUnownedWorkDays(_connection, expectedTarget) {
    let assigned = 0;

    for (const workDay of workDays) {
      if (
        workDay.organizationId === null &&
        workDay.userId === null &&
        workDay.vehicleId === null
      ) {
        workDay.organizationId = expectedTarget.organizationId;
        workDay.userId = expectedTarget.userId;
        workDay.vehicleId = expectedTarget.vehicleId;
        assigned += 1;
      }
    }

    return assigned;
  },
});

const unassignedWorkDay = () => ({
  organizationId: null,
  userId: null,
  vehicleId: null,
});

test("asigna todas las jornadas existentes a Matías", async () => {
  const workDays = [
    unassignedWorkDay(),
    unassignedWorkDay(),
    unassignedWorkDay(),
  ];
  const repository = createFakeRepository(workDays);

  const result = await assignExistingWorkDays(MATIAS_ASSIGNMENT, {
    repository,
  });

  assert.deepEqual(result, {
    assigned: 3,
    total: 3,
    alreadyAssigned: 0,
  });
  assert.ok(
    workDays.every(
      (workDay) =>
        workDay.organizationId === TARGET.organizationId &&
        workDay.userId === TARGET.userId &&
        workDay.vehicleId === TARGET.vehicleId
    )
  );
});

test("una segunda ejecución conserva la asignación", async () => {
  const workDays = [
    {
      organizationId: TARGET.organizationId,
      userId: TARGET.userId,
      vehicleId: TARGET.vehicleId,
    },
  ];
  const repository = createFakeRepository(workDays);

  const result = await assignExistingWorkDays(MATIAS_ASSIGNMENT, {
    repository,
  });

  assert.deepEqual(result, {
    assigned: 0,
    total: 1,
    alreadyAssigned: 1,
  });
});

test("rechaza jornadas parcialmente asignadas", async () => {
  const repository = createFakeRepository([
    {
      organizationId: TARGET.organizationId,
      userId: null,
      vehicleId: null,
    },
  ]);

  await assert.rejects(
    assignExistingWorkDays(MATIAS_ASSIGNMENT, { repository }),
    /asignación incompleta/
  );
});

test("conserva jornadas de otros conductores y asigna solo las huérfanas", async () => {
  const workDays = [
    {
      organizationId: 99,
      userId: 98,
      vehicleId: 97,
    },
    unassignedWorkDay(),
  ];
  const repository = createFakeRepository(workDays);

  const result = await assignExistingWorkDays(MATIAS_ASSIGNMENT, {
    repository,
  });

  assert.deepEqual(result, {
    assigned: 1,
    total: 1,
    alreadyAssigned: 0,
  });
  assert.deepEqual(workDays[0], {
    organizationId: 99,
    userId: 98,
    vehicleId: 97,
  });
  assert.deepEqual(workDays[1], {
    organizationId: TARGET.organizationId,
    userId: TARGET.userId,
    vehicleId: TARGET.vehicleId,
  });
});
