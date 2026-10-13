const getPaymentDirection = (pendingBalance) => {
  if (Number(pendingBalance) > 0) return "OWNER_TO_DRIVER";
  if (Number(pendingBalance) < 0) return "DRIVER_TO_OWNER";
  throw new Error("No hay saldo pendiente para registrar");
};

const validatePaymentAgainstBalance = (amount, pendingBalance) => {
  const amountInCents = Math.round(Number(amount) * 100);
  const pendingInCents = Math.round(Math.abs(Number(pendingBalance)) * 100);

  if (pendingInCents === 0) {
    throw new Error("No hay saldo pendiente para registrar");
  }

  if (amountInCents > pendingInCents) {
    throw new Error("El pago no puede superar el saldo pendiente");
  }
};

module.exports = {
  getPaymentDirection,
  validatePaymentAgainstBalance,
};
