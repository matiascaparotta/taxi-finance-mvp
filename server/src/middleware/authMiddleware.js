const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  verifySession,
} = require("../services/authService");

const requireAuthentication = (req, res, next) => {
  const config = getAuthConfig();

  if (!config.required) {
    next();
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const isAuthenticated = verifySession(
    cookies[COOKIE_NAME],
    config.sessionSecret
  );

  if (!isAuthenticated) {
    res.status(401).json({
      message: "Acceso privado requerido",
    });
    return;
  }

  next();
};

module.exports = {
  requireAuthentication,
};
