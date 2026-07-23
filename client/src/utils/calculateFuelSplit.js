export function calculateFuelSplit(fuelAmount, fuelAllocation) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(fuelAmount)) {
    return null;
  }

  const totalCents = Math.round(Number(fuelAmount) * 100);

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
}
