const validateCancellationConfirmation = (confirmation) => {
  const normalized =
    typeof confirmation === "string"
      ? confirmation.trim().toUpperCase()
      : "";

  if (normalized !== "CANCELAR") {
    throw new Error("Escribe CANCELAR para confirmar");
  }

  return normalized;
};

const assertActiveWorkDayCanBeCancelled = (workDay) => {
  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  if (workDay.status !== "OPEN") {
    throw new Error("Solo se puede cancelar una jornada activa");
  }

  if (Boolean(workDay.isLocked)) {
    throw new Error("La jornada está protegida y no se puede cancelar");
  }
};

const getCancellationActor = (auth) => {
  if (auth?.accessMode !== "user" || !auth.userId) {
    throw new Error(
      "Cancelar una jornada requiere una cuenta personal"
    );
  }

  return {
    actorUserId: Number(auth.userId),
    organizationId: Number(auth.organizationId),
  };
};

module.exports = {
  assertActiveWorkDayCanBeCancelled,
  getCancellationActor,
  validateCancellationConfirmation,
};
