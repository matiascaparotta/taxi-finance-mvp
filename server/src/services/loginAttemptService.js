const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_ACCOUNT_LIMIT = 5;
const DEFAULT_ADDRESS_LIMIT = 25;

const normalizePrincipal = (principal) =>
  typeof principal === "string" && principal.trim()
    ? principal.trim().toLowerCase()
    : "__legacy__";

const createLoginAttemptService = ({
  windowMs = DEFAULT_WINDOW_MS,
  accountLimit = DEFAULT_ACCOUNT_LIMIT,
  addressLimit = DEFAULT_ADDRESS_LIMIT,
} = {}) => {
  const attemptsByAccount = new Map();
  const attemptsByAddress = new Map();

  const readState = (store, key, now) => {
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      if (current) {
        store.delete(key);
      }

      return null;
    }

    return current;
  };

  const increment = (store, key, now) => {
    const current = readState(store, key, now);
    const next = current || {
      count: 0,
      resetAt: now + windowMs,
    };

    next.count += 1;
    store.set(key, next);
    return next;
  };

  const accountKey = (address, principal) =>
    `${address}:${normalizePrincipal(principal)}`;

  const getBlock = (address, principal, now = Date.now()) => {
    const accountState = readState(
      attemptsByAccount,
      accountKey(address, principal),
      now
    );
    const addressState = readState(
      attemptsByAddress,
      address,
      now
    );
    const blockedState =
      accountState?.count >= accountLimit
        ? accountState
        : addressState?.count >= addressLimit
          ? addressState
          : null;

    if (!blockedState) {
      return null;
    }

    return {
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((blockedState.resetAt - now) / 1000)
      ),
    };
  };

  const recordFailure = (
    address,
    principal,
    now = Date.now()
  ) => {
    increment(
      attemptsByAccount,
      accountKey(address, principal),
      now
    );
    increment(attemptsByAddress, address, now);
  };

  const recordSuccess = (address, principal) => {
    attemptsByAccount.delete(accountKey(address, principal));
  };

  return {
    getBlock,
    recordFailure,
    recordSuccess,
  };
};

module.exports = {
  DEFAULT_ACCOUNT_LIMIT,
  DEFAULT_ADDRESS_LIMIT,
  DEFAULT_WINDOW_MS,
  createLoginAttemptService,
  normalizePrincipal,
};
