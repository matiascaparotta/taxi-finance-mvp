const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  readSession,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  signSession,
  verifyPassword,
} = require("../services/authService");
const {
  authenticateUser,
  changeUserPassword,
} = require("../services/userAuthService");

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

const getPublicUser = (session) => {
  if (!session?.userId) {
    return null;
  }

  const isOwner = Boolean(
    session.roles?.isOwner ?? session.isOwner
  );
  const isDriver = Boolean(
    session.roles?.isDriver ?? session.isDriver
  );

  return {
    id: session.userId,
    username: session.username,
    displayName: session.displayName,
    organizationId: session.organizationId,
    organizationName: session.organizationName,
    roles: {
      isOwner,
      isDriver,
    },
    isOwner,
    isDriver,
    mustChangePassword: Boolean(session.mustChangePassword),
  };
};

const setSessionCookie = (res, config, sessionData) => {
  const token = signSession(
    config.sessionSecret,
    config.sessionDurationMs,
    Date.now(),
    sessionData
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

  const hasUsername =
    typeof req.body?.username === "string" &&
    req.body.username.trim() !== "";
  let sessionData = null;

  if (hasUsername) {
    const user = await authenticateUser(req.body);

    if (user) {
      sessionData = {
        accessMode: "user",
        ...user,
      };
    }
  } else if (
    typeof req.body?.password === "string" &&
    verifyPassword(req.body.password, config.passwordHash)
  ) {
    sessionData = {
      accessMode: "legacy",
    };
  }

  if (!sessionData) {
    attemptState.count += 1;
    res.status(401).json({
      message: hasUsername
        ? "Usuario o contraseña incorrectos"
        : "Contraseña incorrecta",
    });
    return;
  }

  attemptsByAddress.delete(address);

  setSessionCookie(res, config, sessionData);
  res.json({
    authenticated: true,
    accessMode: sessionData.accessMode,
    user: getPublicUser(sessionData),
  });
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
  const session = readSession(
    cookies[COOKIE_NAME],
    config.sessionSecret
  );
  const authenticated = session !== null;

  if (authenticated) {
    const { expiresAt, ...sessionData } = session;
    setSessionCookie(res, config, sessionData);
  }

  res.json({
    authenticated,
    authRequired: true,
    accessMode: session?.accessMode || (authenticated ? "legacy" : null),
    user: getPublicUser(session),
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

const changePassword = async (req, res) => {
  const config = getAuthConfig();

  if (req.auth?.accessMode !== "user" || !req.auth.userId) {
    res.status(403).json({
      message: "El cambio de contraseña requiere una cuenta personal",
    });
    return;
  }

  try {
    await changeUserPassword({
      userId: req.auth.userId,
      currentPassword: req.body?.currentPassword,
      newPassword: req.body?.newPassword,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const { expiresAt, ...sessionData } = req.auth;
  const updatedSession = {
    ...sessionData,
    mustChangePassword: false,
  };
  setSessionCookie(res, config, updatedSession);

  res.json({
    authenticated: true,
    accessMode: "user",
    user: getPublicUser(updatedSession),
  });
};

module.exports = {
  changePassword,
  getSession,
  login,
  logout,
};
