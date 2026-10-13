const getPendingBalancePresentation = (balanceValue) => {
  const balance = Number(balanceValue || 0);

  if (balance > 0) {
    return {
      label: "El jefe te debe",
      tone: "border-sky-400/30 bg-sky-400/10 text-sky-200",
    };
  }

  if (balance < 0) {
    return {
      label: "Debes entregar al jefe",
      tone: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    };
  }

  return {
    label: "No hay saldo pendiente",
    tone: "border-slate-600 bg-slate-800/70 text-slate-200",
  };
};

export { getPendingBalancePresentation };
