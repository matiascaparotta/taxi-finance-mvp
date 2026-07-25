const userAuthRepository = require("../repositories/userAuthRepository");
const {
  hashPassword,
  verifyPassword,
} = require("./authService");

const normalizeUsername = (username) =>
  typeof username === "string"
    ? username.trim().toLowerCase()
    : "";

const authenticateUser = async (
  credentials,
  {
    repository = userAuthRepository,
    passwordVerifier = verifyPassword,
  } = {}
) => {
  const username = normalizeUsername(credentials?.username);
  const password = credentials?.password;

  if (!username || typeof password !== "string" || !password) {
    return null;
  }

  const user = await repository.findActiveUserForLogin(username);

  if (!user || !passwordVerifier(password, user.passwordHash)) {
    return null;
  }

  return {
    userId: Number(user.userId),
    username: user.username,
    displayName: user.displayName,
    organizationId: Number(user.organizationId),
    organizationName: user.organizationName,
    isOwner: Boolean(user.isOwner),
    isDriver: Boolean(user.isDriver),
    mustChangePassword: Boolean(user.mustChangePassword),
  };
};

const validateNewPassword = (password) => {
  if (typeof password !== "string" || password.length < 10) {
    throw new Error(
      "La contraseña nueva debe tener al menos 10 caracteres"
    );
  }

  if (password.length > 128) {
    throw new Error(
      "La contraseña nueva no puede superar los 128 caracteres"
    );
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error(
      "La contraseña nueva debe incluir una letra y un número"
    );
  }
};

const changeUserPassword = async (
  { userId, currentPassword, newPassword },
  {
    repository = userAuthRepository,
    passwordVerifier = verifyPassword,
    passwordHasher = hashPassword,
  } = {}
) => {
  validateNewPassword(newPassword);

  if (
    typeof currentPassword !== "string" ||
    !currentPassword
  ) {
    throw new Error("La contraseña actual es obligatoria");
  }

  const user = await repository.findActiveUserForPasswordChange(
    userId
  );

  if (
    !user ||
    !passwordVerifier(currentPassword, user.passwordHash)
  ) {
    throw new Error("La contraseña actual es incorrecta");
  }

  if (passwordVerifier(newPassword, user.passwordHash)) {
    throw new Error(
      "La contraseña nueva debe ser diferente de la actual"
    );
  }

  const updated = await repository.updatePassword(
    userId,
    user.passwordHash,
    passwordHasher(newPassword)
  );

  if (!updated) {
    throw new Error(
      "La contraseña cambió en otra sesión. Vuelve a intentarlo."
    );
  }

  return {
    userId: Number(userId),
    mustChangePassword: false,
  };
};

module.exports = {
  authenticateUser,
  changeUserPassword,
  normalizeUsername,
  validateNewPassword,
};
