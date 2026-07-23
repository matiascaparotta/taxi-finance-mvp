const validateStartKm = (startKm, lastEndKm, resetOdometer = false) => {
  if (startKm === undefined || startKm === null || startKm === "") {
    throw new Error("El kilometraje inicial es obligatorio");
  }

  const numericStartKm = Number(startKm);

  if (!Number.isFinite(numericStartKm) || numericStartKm < 0) {
    throw new Error("El kilometraje inicial debe ser un número válido");
  }

  const hasPreviousMileage =
    lastEndKm !== undefined && lastEndKm !== null && lastEndKm !== "";

  if (
    hasPreviousMileage &&
    numericStartKm < Number(lastEndKm) &&
    resetOdometer !== true
  ) {
    throw new Error(
      `El kilometraje inicial no puede ser inferior a ${Number(lastEndKm)} km`
    );
  }

  return numericStartKm;
};

module.exports = {
  validateStartKm,
};
