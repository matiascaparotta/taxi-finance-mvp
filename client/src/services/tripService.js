const API_URL = "http://localhost:3000";

export const createTrip = async (tripData) => {
  const response = await fetch(`${API_URL}/trips`, {
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

export const getTripsByWorkDay = async (workDayId) => {
  const response = await fetch(`${API_URL}/trips?workDayId=${workDayId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};