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

    if (before.assignedElsewhere > 0) {
      throw new Error(
        "Existen jornadas pertenecientes a otro conductor"
      );
    }

    if (before.assignedToTarget > 0 && before.unassigned > 0) {
      throw new Error(
        "La base contiene una mezcla de jornadas asignadas y sin asignar"
      );
    }

    if (before.unassigned === 0) {
      return {
        assigned: 0,
        total: before.total,
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
      after.assignedToTarget !== before.total ||
      after.unassigned !== 0
    ) {
      throw new Error(
        "No se pudo verificar la asignación de todas las jornadas"
      );
    }

    return {
      assigned,
      total: after.total,
      alreadyAssigned: 0,
    };
  });

module.exports = {
  assignExistingWorkDays,
};
