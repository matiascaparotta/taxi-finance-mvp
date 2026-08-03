import { apiFetch } from "./apiClient";

export const getWorkDays = async () => {
  const response = await apiFetch("/work-days");

  if (!response.ok) {
    throw new Error("Error al obtener las jornadas");
  }

  const data = await response.json();

  return data.data;
};


export const createWorkDay = async (workDayData) => {
  const response = await apiFetch("/work-days", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workDayData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  
  return data.data;
};
export const getOpenWorkDay = async () => {
  const response = await apiFetch("/work-days/open");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
export const getLatestClosedWorkDay = async () => {
  const response = await apiFetch("/work-days/latest-closed");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
export const closeWorkDay = async (workDayId, closeData) => {
  const response = await apiFetch(`/work-days/${workDayId}/close`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(closeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
export const getWorkDayById = async (workDayId) => {
  const response = await apiFetch(`/work-days/${workDayId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const deleteWorkDay = async (workDayId) => {
  const response = await apiFetch(`/work-days/${workDayId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};

export const correctClosedWorkDay = async (workDayId, correctionData) => {
  const response = await apiFetch(`/work-days/${workDayId}/correction`, {
    method: "PUT",
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
