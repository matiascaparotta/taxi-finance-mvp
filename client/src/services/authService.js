import { apiFetch } from "./apiClient";

const readResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo validar el acceso");
  }

  return data;
};

export const getSession = async () =>
  readResponse(await apiFetch("/auth/session"));

export const login = async ({ username, password }) =>
  readResponse(
    await apiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
  );

export const logout = async () =>
  readResponse(
    await apiFetch("/auth/logout", {
      method: "POST",
    })
  );
