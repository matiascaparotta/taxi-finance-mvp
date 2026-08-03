const assertWorkDayCanBeDeleted = (workDay) => {
  if (!workDay) {
    throw new Error("Jornada no encontrada");
  }

  if (Boolean(workDay.isLocked)) {
    throw new Error(
      "Las jornadas históricas importadas están protegidas y no se pueden eliminar"
    );
  }
};

const validateWorkDayDeletionConfirmation = (confirmation) => {
  if (confirmation === undefined || confirmation === null) {
    throw new Error(
      "Esta pantalla está desactualizada. Cierra y vuelve a abrir TaxFin antes de eliminar la jornada"
    );
  }

  const normalized =
    typeof confirmation === "string"
      ? confirmation.trim().toUpperCase()
      : "";

  if (normalized !== "ELIMINAR") {
    throw new Error("Escribe ELIMINAR para confirmar");
  }

  return normalized;
};

module.exports = {
  assertWorkDayCanBeDeleted,
  validateWorkDayDeletionConfirmation,
};
