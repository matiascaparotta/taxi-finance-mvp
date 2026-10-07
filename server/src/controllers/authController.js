const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  signSession,
  verifyPassword,
  readSession,
} = require("../services/authService");
const { getUserByUsername } = require("../repositories/userRepository");

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

const login = async (req, res) => {
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

  const username = String(req.body?.username || "matias").trim().toLowerCase();
  const password = req.body?.password;
  let user = null;

  if (
    username === "matias" &&
    verifyPassword(password || "", config.passwordHash)
  ) {
    user = {
      id: 1,
      username: "matias",
      fullName: "Matías Caparotta",
      taxiLicense: "249",
      role: "owner",
    };
  } else if (username !== "matias" && typeof password === "string") {
    user = await getUserByUsername(username);
    if (!user?.isActive || !verifyPassword(password, user.passwordHash)) {
      user = null;
    }
  }

  if (!user) {
    attemptState.count += 1;
    res.status(401).json({
      message: "Contraseña incorrecta",
    });
    return;
  }

  attemptsByAddress.delete(address);

  const token = signSession(
    config.sessionSecret,
    config.sessionDurationMs,
    Date.now(),
    sanitizeUser(user)
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
  res.json({ authenticated: true, user: sanitizeUser(user) });
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  fullName: user.fullName,
  taxiLicense: user.taxiLicense,
  role: user.role,
});

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
  const session = readSession(
    cookies[COOKIE_NAME],
    config.sessionSecret
  );
  const authenticated = Boolean(session);

  if (authenticated) {
    const token = signSession(
      config.sessionSecret,
      config.sessionDurationMs,
      Date.now(),
      session.user || session.userId || 1
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
  }

  res.json({
    authenticated,
    authRequired: true,
    userId: authenticated ? session.userId || 1 : null,
    user: authenticated ? session.user || null : null,
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
