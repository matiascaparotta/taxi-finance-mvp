export const isOwnerUser = (user) =>
  Boolean(user?.roles?.isOwner ?? user?.isOwner);

export const getUserRoleLabel = (user) => {
  if (isOwnerUser(user)) {
    return "Propietario";
  }

  if (user?.roles?.isDriver ?? user?.isDriver) {
    return "Conductor";
  }

  return "Usuario";
};

export const getUserInitials = (displayName = "") => {
  const words = displayName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "TF";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("es-ES");
};

export const getUserNavigation = (user) => [
  { id: "home", label: "Inicio", to: "/" },
  { id: "work-day", label: "Mi jornada", to: "/my-work-day" },
  ...(isOwnerUser(user)
    ? [{ id: "drivers", label: "Mis conductores", to: "/drivers" }]
    : []),
  { id: "monthly", label: "Mensual", to: "/monthly" },
  { id: "history", label: "Historial", to: "/history" },
];
