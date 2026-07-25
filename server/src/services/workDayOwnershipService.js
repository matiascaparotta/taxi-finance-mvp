const workDayOwnershipRepository = require(
  "../repositories/workDayOwnershipRepository"
);

const assignExistingWorkDays = async (
  assignment,
  { repository = workDayOwnershipRepository } = {}
) =>
  repository.withTransaction(async (connection) => {
    const target = await repository.findAssignmentTarget(
      connection,
      assignment
    );

    if (!target) {
      throw new Error(
        "No existe un conductor y vehículo activos para la asignación"
      );
    }

    await repository.lockWorkDays(connection);

    const before = await repository.getOwnershipStats(
      connection,
      target
    );

    if (before.partial > 0) {
      throw new Error(
        "Existen jornadas con una asignación incompleta"
      );
    }

    if (before.unassigned === 0) {
      return {
        assigned: 0,
        total: before.assignedToTarget,
        alreadyAssigned: before.assignedToTarget,
      };
    }

    const assigned = await repository.assignUnownedWorkDays(
      connection,
      target
    );
    const after = await repository.getOwnershipStats(
      connection,
      target
    );

    if (
      assigned !== before.unassigned ||
      after.assignedToTarget !==
        before.assignedToTarget + before.unassigned ||
      after.unassigned !== 0 ||
      after.assignedElsewhere !== before.assignedElsewhere ||
      after.total !== before.total
    ) {
      throw new Error(
        "No se pudo verificar la asignación de las jornadas sin propietario"
      );
    }

    return {
      assigned,
      total: after.assignedToTarget,
      alreadyAssigned: before.assignedToTarget,
    };
  });

module.exports = {
  assignExistingWorkDays,
};
