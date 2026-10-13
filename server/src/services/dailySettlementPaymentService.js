const {
  createPayment,
} = require("../repositories/dailySettlementPaymentRepository");

const MONEY_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;
const IDEMPOTENCY_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

const registerDailySettlementPayment = async (
  data,
  auth,
  paymentCreator = createPayment
) => {
  if (
    auth?.accessMode !== "user" ||
    auth?.settlementMode !== "DAILY_50_50"
  ) {
    throw new Error("Tu perfil no utiliza liquidación diaria");
  }

  const rawAmount = String(data?.amount ?? "").trim();
  if (!MONEY_PATTERN.test(rawAmount)) {
    throw new Error("Ingresa un importe válido con hasta dos decimales");
  }

  const amount = Number(rawAmount.replace(",", "."));
  if (!(amount > 0)) {
    throw new Error("El pago debe ser mayor que cero");
  }

  const idempotencyKey = String(data?.idempotencyKey || "").trim();
  if (!IDEMPOTENCY_PATTERN.test(idempotencyKey)) {
    throw new Error("No se pudo identificar el pago de forma segura");
  }

  return paymentCreator({
    organizationId: Number(auth.organizationId),
    driverUserId: Number(auth.userId),
    amount,
    idempotencyKey,
  });
};

module.exports = {
  registerDailySettlementPayment,
};
