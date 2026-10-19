import { apiFetch } from "./apiClient";

const registerDailySettlementPayment = async ({ amount, idempotencyKey }) => {
  const response = await apiFetch("/daily-settlements/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, idempotencyKey }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

const registerDailySettlementAdjustment = async ({
  workDayId,
  direction,
  amount,
  reason,
  idempotencyKey,
}) => {
  const response = await apiFetch("/daily-settlements/adjustments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workDayId, direction, amount, reason, idempotencyKey }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
};

export { registerDailySettlementAdjustment, registerDailySettlementPayment };
