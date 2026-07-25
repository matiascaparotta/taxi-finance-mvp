const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  readSession,
} = require("../services/authService");

const requireAuthentication = (req, res, next) => {
  const config = getAuthConfig();

  if (!config.required) {
    next();
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const session = readSession(
    cookies[COOKIE_NAME],
    config.sessionSecret
  );

  if (!session) {
    res.status(401).json({
      message: "Acceso privado requerido",
    });
    return;
  }

  req.auth = {
    ...session,
    accessMode: session.accessMode || "legacy",
  };
  next();
};

const requireCompletedPasswordChange = (req, res, next) => {
  if (
    req.auth?.accessMode === "user" &&
    req.auth.mustChangePassword
  ) {
    res.status(403).json({
      code: "PASSWORD_CHANGE_REQUIRED",
      message: "Debes cambiar la contraseña temporal",
    });
    return;
  }

  next();
};

module.exports = {
  requireAuthentication,
  requireCompletedPasswordChange,
};
