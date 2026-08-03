import { API_URL } from "../config/api";

export const apiFetch = async (path, options = {}) => {
  const method = String(options.method || "GET").toUpperCase();

  if (
    typeof navigator !== "undefined" &&
    navigator.onLine === false &&
    !["GET", "HEAD"].includes(method)
  ) {
    throw new Error(
      "Sin conexión. TaxFin no guardó ningún cambio. Recupera internet e inténtalo nuevamente."
    );
  }

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

  if (
    response.status === 403 &&
    !path.startsWith("/auth/")
  ) {
    const body = await response
      .clone()
      .json()
      .catch(() => null);

    if (body?.code === "PASSWORD_CHANGE_REQUIRED") {
      window.dispatchEvent(
        new CustomEvent("taxfin:password-change-required")
      );
    }
  }

  return response;
};
