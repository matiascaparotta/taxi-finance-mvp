const validateFuelAmount = (fuelAmount) => {
  const normalizedAmount =
    typeof fuelAmount === "number" ? String(fuelAmount) : fuelAmount;

  if (
    typeof normalizedAmount !== "string" ||
    !/^\d+(?:\.\d{1,2})?$/.test(normalizedAmount)
  ) {
    throw new Error(
      "Introduce un importe de combustible válido, con hasta 2 decimales"
    );
  }

  const amount = Number(normalizedAmount);

  if (!Number.isFinite(amount)) {
    throw new Error("El importe de combustible no es válido");
  }

  return amount;
};

module.exports = {
  validateFuelAmount,
};
