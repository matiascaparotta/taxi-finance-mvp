const crypto = require("node:crypto");

const COOKIE_NAME = "taxi_finance_session";
const SCRYPT_KEY_LENGTH = 64;

const hashPassword = (password, salt = crypto.randomBytes(16)) => {
  const derivedKey = crypto.scryptSync(
    password,
    salt,
    SCRYPT_KEY_LENGTH
  );

  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
};

const verifyPassword = (password, storedHash) => {
  const [algorithm, saltHex, hashHex] = storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !saltHex ||
    !hashHex
  ) {
    return false;
  }

  try {
    const expectedHash = Buffer.from(hashHex, "hex");
    const actualHash = crypto.scryptSync(
      password,
      Buffer.from(saltHex, "hex"),
      expectedHash.length
    );

    return crypto.timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
};

const signSession = (
  secret,
  durationMs,
  now = Date.now()
) => {
  const payload = Buffer.from(
    JSON.stringify({
      expiresAt: now + durationMs,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

const verifySession = (token, secret, now = Date.now()) => {
  if (!token || !secret) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest();
  const receivedSignature = Buffer.from(signature, "base64url");

  if (
    expectedSignature.length !== receivedSignature.length ||
    !crypto.timingSafeEqual(
      expectedSignature,
      receivedSignature
    )
  ) {
    return false;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return Number(session.expiresAt) > now;
  } catch {
    return false;
  }
};

const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf("=");

        if (separatorIndex === -1) {
          return [cookie, ""];
        }

        return [
          cookie.slice(0, separatorIndex),
          decodeURIComponent(cookie.slice(separatorIndex + 1)),
        ];
      })
  );

const serializeSessionCookie = (
  token,
  { secureCookie, maxAgeSeconds, now = Date.now() }
) => {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    `Expires=${new Date(
      now + maxAgeSeconds * 1000
    ).toUTCString()}`,
  ];

  if (secureCookie) {
    parts.push("Secure");
  }

  return parts.join("; ");
};

const serializeExpiredSessionCookie = (secureCookie) =>
  serializeSessionCookie("", {
    secureCookie,
    maxAgeSeconds: 0,
  });

module.exports = {
  COOKIE_NAME,
  hashPassword,
  parseCookies,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  signSession,
  verifyPassword,
  verifySession,
};
