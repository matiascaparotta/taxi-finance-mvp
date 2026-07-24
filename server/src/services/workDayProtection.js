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

module.exports = {
  assertWorkDayCanBeDeleted,
};
