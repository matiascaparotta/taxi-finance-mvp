const isIndividualAccess = (auth) => auth?.accessMode === "user";

const getReadScope = (auth) => {
  if (!isIndividualAccess(auth)) {
    return null;
  }

  return {
    organizationId: Number(auth.organizationId),
    userId: Number(auth.userId),
    canReadOrganization: Boolean(
      auth.roles?.isOwner ?? auth.isOwner
    ),
  };
};

const getWriteScope = (auth) => {
  if (!isIndividualAccess(auth)) {
    return null;
  }

  return {
    organizationId: Number(auth.organizationId),
    userId: Number(auth.userId),
  };
};

const canManageWorkDay = (workDay, auth) => {
  if (!isIndividualAccess(auth)) {
    return true;
  }

  return (
    Number(workDay.organizationId) === Number(auth.organizationId) &&
    Number(workDay.driverUserId) === Number(auth.userId)
  );
};

module.exports = {
  getReadScope,
  getWriteScope,
  canManageWorkDay,
};
