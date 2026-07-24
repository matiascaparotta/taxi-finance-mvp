const DEVELOPMENT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const normalizeOrigin = (origin) =>
  origin.trim().replace(/\/+$/, "");

const getAllowedOrigins = (environment = process.env) => {
  const configuredOrigins = environment.CLIENT_ORIGINS
    ?.split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  if (configuredOrigins?.length > 0) {
    return new Set(configuredOrigins);
  }

  if (environment.NODE_ENV === "production") {
    throw new Error(
      "CLIENT_ORIGINS es obligatorio en producción"
    );
  }

  return new Set(DEVELOPMENT_ORIGINS);
};

const createCorsOptions = (environment = process.env) => {
  const allowedOrigins = getAllowedOrigins(environment);

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      const error = new Error("Origen no permitido");
      error.code = "CORS_ORIGIN_DENIED";
      callback(error);
    },
  };
};

module.exports = {
  DEVELOPMENT_ORIGINS,
  createCorsOptions,
  getAllowedOrigins,
  normalizeOrigin,
};
