const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  signSession,
  verifyPassword,
  verifySession,
} = require("../services/authService");

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attemptsByAddress = new Map();

const getAttemptState = (address, now = Date.now()) => {
  const current = attemptsByAddress.get(address);

  if (!current || current.resetAt <= now) {
    const next = {
      count: 0,
      resetAt: now + ATTEMPT_WINDOW_MS,
    };
    attemptsByAddress.set(address, next);
    return next;
  }

  return current;
};

const login = (req, res) => {
  const config = getAuthConfig();

  if (!config.required) {
    res.json({ authenticated: true });
    return;
  }

  const address = req.ip || req.socket.remoteAddress || "unknown";
  const attemptState = getAttemptState(address);

  if (attemptState.count >= MAX_ATTEMPTS) {
    res.status(429).json({
      message: "Demasiados intentos. Espera 15 minutos.",
    });
    return;
  }

  if (
    typeof req.body?.password !== "string" ||
    !verifyPassword(req.body.password, config.passwordHash)
  ) {
    attemptState.count += 1;
    res.status(401).json({
      message: "Contraseña incorrecta",
    });
    return;
  }

  attemptsByAddress.delete(address);

  const token = signSession(
    config.sessionSecret,
    config.sessionDurationMs
  );

  res.setHeader(
    "Set-Cookie",
    serializeSessionCookie(token, {
      secureCookie: config.secureCookie,
      maxAgeSeconds: Math.floor(
        config.sessionDurationMs / 1000
      ),
    })
  );
  res.json({ authenticated: true });
};

const getSession = (req, res) => {
  const config = getAuthConfig();

  if (!config.required) {
    res.json({
      authenticated: true,
      authRequired: false,
    });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);

  res.json({
    authenticated: verifySession(
      cookies[COOKIE_NAME],
      config.sessionSecret
    ),
    authRequired: true,
  });
};

const logout = (req, res) => {
  const config = getAuthConfig();

  res.setHeader(
    "Set-Cookie",
    serializeExpiredSessionCookie(config.secureCookie)
  );
  res.json({ authenticated: false });
};

module.exports = {
  getSession,
  login,
  logout,
};
