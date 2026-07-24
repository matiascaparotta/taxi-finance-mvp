import { apiFetch } from "./apiClient";

export const getWorkDaySummary = async (workDayId) => {
  const response = await apiFetch(
    `/work-days/${workDayId}/summary`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
