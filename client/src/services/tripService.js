import { apiFetch } from "./apiClient";

export const createTrip = async (tripData) => {
  const response = await apiFetch("/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
export const getTripById = async (tripId) => {
  const response = await apiFetch(`/trips/${tripId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const updateTrip = async (tripId, tripData) => {
  const response = await apiFetch(`/trips/${tripId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const deleteTrip = async (tripId, correctionData = {}) => {
  const response = await apiFetch(`/trips/${tripId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(correctionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const getTripsByWorkDay = async (workDayId) => {
  const response = await apiFetch(
    `/trips?workDayId=${workDayId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
