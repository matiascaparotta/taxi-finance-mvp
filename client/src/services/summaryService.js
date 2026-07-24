import { API_URL } from "../config/api";

export const getWorkDaySummary = async (workDayId) => {
  const response = await fetch(`${API_URL}/work-days/${workDayId}/summary`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
