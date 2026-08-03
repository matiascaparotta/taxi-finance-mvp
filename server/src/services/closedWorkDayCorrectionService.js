const { verifyPassword } = require("./authService");
const userAuthRepository = require(
  "../repositories/userAuthRepository"
);

const normalizeCorrectionReason = (reason) => {
  const normalizedReason =
    typeof reason === "string" ? reason.trim() : "";

  if (normalizedReason.length < 5) {
    throw new Error(
      "Explica el motivo de la corrección con al menos 5 caracteres"
    );
  }

  if (normalizedReason.length > 500) {
    throw new Error(
      "El motivo de la corrección no puede superar los 500 caracteres"
    );
  }

  return normalizedReason;
};

const authorizeClosedWorkDayCorrection = async (
  { auth, password, reason },
  {
    repository = userAuthRepository,
    passwordVerifier = verifyPassword,
  } = {}
) => {
  if (auth?.accessMode !== "user" || !auth.userId) {
    throw new Error(
      "La corrección de una jornada cerrada requiere una cuenta personal"
    );
  }

  if (typeof password !== "string" || !password) {
    throw new Error("La contraseña actual es obligatoria");
  }

  const normalizedReason = normalizeCorrectionReason(reason);
  const user = await repository.findActiveUserForPasswordChange(
    auth.userId
  );

  if (!user || !passwordVerifier(password, user.passwordHash)) {
    throw new Error("La contraseña actual es incorrecta");
  }

  return {
    actorUserId: Number(auth.userId),
    organizationId: Number(auth.organizationId),
    reason: normalizedReason,
  };
};

module.exports = {
  authorizeClosedWorkDayCorrection,
  normalizeCorrectionReason,
};
