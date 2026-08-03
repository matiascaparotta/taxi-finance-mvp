import { apiFetch } from "./apiClient";

const parseResponse = async (response) => {
  const body = await response.json();
  if (!response.ok) throw new Error(body.message);
  return body.data;
};

const driverQuery = (driverUserId) =>
  driverUserId ? `?driverUserId=${encodeURIComponent(driverUserId)}` : "";

export const getMonthlySettlement = async (month, driverUserId) =>
  parseResponse(
    await apiFetch(`/monthly-settlements/${month}${driverQuery(driverUserId)}`)
  );

export const getMonthlySettlementHistory = async (year, driverUserId) => {
  const query = new URLSearchParams({ year: String(year) });
  if (driverUserId) query.set("driverUserId", driverUserId);
  return parseResponse(await apiFetch(`/monthly-settlements?${query}`));
};

export const updateMonthlySettings = async (month, settings, driverUserId) =>
  parseResponse(
    await apiFetch(
      `/monthly-settlements/${month}/settings${driverQuery(driverUserId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }
    )
  );

export const closeMonthlySettlement = async (month, confirmation) =>
  parseResponse(
    await apiFetch(`/monthly-settlements/${month}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation }),
    })
  );
