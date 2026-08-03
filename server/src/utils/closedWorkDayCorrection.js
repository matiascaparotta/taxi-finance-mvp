const normalizeKilometre = (value, label) => {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${label} es obligatorio`);
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0) {
    throw new Error(`${label} debe ser un número entero válido`);
  }

  return numericValue;
};

const validateCorrectedKilometres = ({
  startKm,
  endKm,
  previousEndKm = null,
  nextStartKm = null,
}) => {
  const normalizedStartKm = normalizeKilometre(
    startKm,
    "El kilometraje inicial"
  );
  const normalizedEndKm = normalizeKilometre(
    endKm,
    "El kilometraje final"
  );

  if (normalizedEndKm < normalizedStartKm) {
    throw new Error("El kilometraje final no puede ser menor al inicial");
  }

  if (
    previousEndKm !== null &&
    normalizedStartKm < Number(previousEndKm)
  ) {
    throw new Error(
      `El kilometraje inicial no puede ser menor a los ${previousEndKm} km de la jornada anterior del vehículo`
    );
  }

  if (
    nextStartKm !== null &&
    normalizedEndKm > Number(nextStartKm)
  ) {
    throw new Error(
      `El kilometraje final no puede superar los ${nextStartKm} km de la jornada siguiente del vehículo`
    );
  }

  return {
    startKm: normalizedStartKm,
    endKm: normalizedEndKm,
  };
};

module.exports = {
  normalizeKilometre,
  validateCorrectedKilometres,
};
