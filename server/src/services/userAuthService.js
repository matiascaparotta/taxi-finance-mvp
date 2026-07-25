const userAuthRepository = require("../repositories/userAuthRepository");
const { verifyPassword } = require("./authService");

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

module.exports = {
  authenticateUser,
  normalizeUsername,
};
