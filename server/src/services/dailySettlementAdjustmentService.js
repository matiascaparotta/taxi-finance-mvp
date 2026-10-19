const {
  createAdjustment,
} = require("../repositories/dailySettlementAdjustmentRepository");

const MONEY_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;
const IDEMPOTENCY_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const DIRECTIONS = new Set(["OWNER_TO_DRIVER", "DRIVER_TO_OWNER"]);

const registerDailySettlementAdjustment = async (
  data,
  auth,
  adjustmentCreator = createAdjustment
) => {
  const isOwner = Boolean(auth?.roles?.isOwner ?? auth?.isOwner);
  if (
    auth?.accessMode !== "user" ||
    (!isOwner && auth?.settlementMode !== "DAILY_50_50")
  ) {
    throw new Error("Tu perfil no utiliza liquidación diaria");
  }

  const workDayId = Number(data?.workDayId);
  if (!Number.isInteger(workDayId) || workDayId <= 0) {
    throw new Error("La jornada del ajuste no es válida");
  }

  const rawAmount = String(data?.amount ?? "").trim();
  if (!MONEY_PATTERN.test(rawAmount) || !(Number(rawAmount.replace(",", ".")) > 0)) {
    throw new Error("Ingresa un importe válido mayor que cero");
  }

  const direction = String(data?.direction || "").trim();
  if (!DIRECTIONS.has(direction)) {
    throw new Error("Indica quién debe entregar el importe");
  }

  const reason = String(data?.reason || "").trim().replace(/\s+/g, " ");
  if (reason.length < 3 || reason.length > 160) {
    throw new Error("El motivo debe tener entre 3 y 160 caracteres");
  }

  const idempotencyKey = String(data?.idempotencyKey || "").trim();
  if (!IDEMPOTENCY_PATTERN.test(idempotencyKey)) {
    throw new Error("No se pudo identificar el ajuste de forma segura");
  }

  return adjustmentCreator({
    workDayId,
    organizationId: Number(auth.organizationId),
    driverUserId: isOwner ? null : Number(auth.userId),
    actorUserId: Number(auth.userId),
    direction,
    amount: Number(rawAmount.replace(",", ".")),
    reason,
    idempotencyKey,
  });
};

module.exports = { registerDailySettlementAdjustment };
