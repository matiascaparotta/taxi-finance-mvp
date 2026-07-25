import { apiFetch } from "./apiClient";

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const getDrivers = async () =>
  parseResponse(await apiFetch("/drivers"));

export const createDriver = async (driver) =>
  parseResponse(
    await apiFetch("/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    })
  );

export const updateDriverStatus = async (driverId, status) =>
  parseResponse(
    await apiFetch(`/drivers/${driverId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  );

export const resetDriverPassword = async (driverId) =>
  parseResponse(
    await apiFetch(`/drivers/${driverId}/reset-password`, {
      method: "POST",
    })
  );
