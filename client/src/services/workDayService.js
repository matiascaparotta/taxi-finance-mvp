const API_URL = "http://localhost:3000";

export const getWorkDays = async () => {
  const response = await fetch(`${API_URL}/work-days`);

  if (!response.ok) {
    throw new Error("Error al obtener las jornadas");
  }

  const data = await response.json();

  return data.data;
};