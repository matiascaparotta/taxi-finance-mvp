export function getDailySettlementPresentation(settlement) {
  const balance = Math.abs(Number(settlement?.balance || 0));

  if (settlement?.balanceDirection === "OWNER_PAYS_DRIVER") {
    return {
      amount: balance,
      eyebrow: "SALDO A TU FAVOR",
      title: "El jefe debe pagarte",
      description:
        "Es la diferencia entre lo que te corresponde y el efectivo que conservaste.",
      tone: "sky",
    };
  }

  if (settlement?.balanceDirection === "DRIVER_PAYS_OWNER") {
    return {
      amount: balance,
      eyebrow: "SALDO A FAVOR DEL JEFE",
      title: "Debes entregar al jefe",
      description:
        "Conservaste más efectivo que el total que te corresponde en esta jornada.",
      tone: "amber",
    };
  }

  return {
    amount: 0,
    eyebrow: "CUENTAS AL DÍA",
    title: "La jornada quedó saldada",
    description: "No queda ninguna diferencia pendiente por esta jornada.",
    tone: "slate",
  };
}
