import { API_URL } from "../config/api";

export const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    !path.startsWith("/auth/")
  ) {
    window.dispatchEvent(
      new CustomEvent("taxfin:unauthorized")
    );
  }

  return response;
};
