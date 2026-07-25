const { getAuthConfig } = require("../config/auth");
const {
  COOKIE_NAME,
  parseCookies,
  readSession,
} = require("../services/authService");
const userAuthRepository = require(
  "../repositories/userAuthRepository"
);

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
    roles: session.roles || {
      isOwner: Boolean(session.isOwner),
      isDriver: Boolean(session.isDriver),
    },
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

const createRequireActiveUserSession = ({
  repository = userAuthRepository,
} = {}) => async (req, res, next) => {
  if (req.auth?.accessMode !== "user") {
    next();
    return;
  }

  try {
    const accessState = await repository.getUserAccessState(
      req.auth.userId,
      req.auth.organizationId
    );

    if (!accessState?.active) {
      res.status(401).json({
        code: "USER_ACCESS_INACTIVE",
        message: "La cuenta ya no tiene acceso a esta organización",
      });
      return;
    }

    if (accessState.mustChangePassword) {
      req.auth.mustChangePassword = true;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const requireActiveUserSession = createRequireActiveUserSession();

const requireOwner = (req, res, next) => {
  const isOwner = Boolean(
    req.auth?.roles?.isOwner ?? req.auth?.isOwner
  );

  if (
    req.auth?.accessMode !== "user" ||
    !isOwner
  ) {
    res.status(403).json({
      code: "OWNER_ACCESS_REQUIRED",
      message: "Esta acción requiere una cuenta propietaria",
    });
    return;
  }

  next();
};

module.exports = {
  requireAuthentication,
  requireActiveUserSession,
  requireCompletedPasswordChange,
  requireOwner,
  createRequireActiveUserSession,
};
