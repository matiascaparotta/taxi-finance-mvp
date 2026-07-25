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

const calculateFuelSplit = (fuelAmount, fuelAllocation) => {
  const amount = validateFuelAmount(fuelAmount);

  if (!["OWN", "SHARED"].includes(fuelAllocation)) {
    throw new Error("Indica cómo corresponde la carga de combustible");
  }

  const totalCents = Math.round(amount * 100);

  if (fuelAllocation === "SHARED") {
    const fuelJoseCents = Math.floor(totalCents / 2);

    return {
      fuelOwn: (totalCents - fuelJoseCents) / 100,
      fuelJose: fuelJoseCents / 100,
    };
  }

  return {
    fuelOwn: totalCents / 100,
    fuelJose: 0,
  };
};

const resolveFuelAllocation = (
  requestedAllocation,
  { isOwner = false } = {}
) => (isOwner ? "OWN" : requestedAllocation);

module.exports = {
  calculateFuelSplit,
  resolveFuelAllocation,
  validateFuelAmount,
};
