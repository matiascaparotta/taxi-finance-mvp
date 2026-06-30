const API_URL = "http://localhost:3000";

export const getWorkDays = async () => {
  const response = await fetch(`${API_URL}/work-days`);

  if (!response.ok) {
    throw new Error("Error al obtener las jornadas");
  }

  const data = await response.json();

  return data.data;
};


export const createWorkDay = async (workDayData) => {
  const response = await fetch(`${API_URL}/work-days`, {
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
  const response = await fetch(`${API_URL}/work-days/open`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};
export const closeWorkDay = async (workDayId, closeData) => {
  const response = await fetch(`${API_URL}/work-days/${workDayId}/close`, {
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
  const response = await fetch(`${API_URL}/work-days/${workDayId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};