const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  readSession,
} = require("../services/authService");

const requireAuthentication = (req, res, next) => {
  const config = getAuthConfig();

  if (!config.required) {
    req.user = { id: 1 };
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

  req.user = { id: Number(session.userId || 1) };
  next();
};

module.exports = {
  requireAuthentication,
};
