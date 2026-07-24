const getAuthConfig = (environment = process.env) => {
  const required =
    environment.NODE_ENV === "production" ||
    environment.AUTH_REQUIRED === "true";
  const sessionSecret = environment.SESSION_SECRET || "";
  const passwordHash = environment.ACCESS_PASSWORD_HASH || "";

  if (required && sessionSecret.length < 32) {
    throw new Error(
      "SESSION_SECRET debe tener al menos 32 caracteres"
    );
  }

  if (required && !passwordHash.startsWith("scrypt$")) {
    throw new Error(
      "ACCESS_PASSWORD_HASH no está configurado correctamente"
    );
  }

  return {
    required,
    sessionSecret,
    passwordHash,
    secureCookie:
      environment.NODE_ENV === "production" ||
      environment.COOKIE_SECURE === "true",
    sessionDurationMs:
      Number(environment.SESSION_DURATION_DAYS || 30) *
      24 *
      60 *
      60 *
      1000,
  };
};

module.exports = {
  getAuthConfig,
};
