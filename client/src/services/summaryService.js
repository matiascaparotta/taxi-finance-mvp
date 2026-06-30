const API_URL = "http://localhost:3000";

export const getWorkDaySummary = async (workDayId) => {
  const response = await fetch(`${API_URL}/work-days/${workDayId}/summary`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};