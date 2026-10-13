export function getCloseFuelPolicy(currentUser) {
  const isOwner = Boolean(
    currentUser?.roles?.isOwner ?? currentUser?.isOwner
  );
  const isDailySettlement =
    currentUser?.settlementMode === "DAILY_50_50";

  return {
    isDailySettlement,
    isOwnOnly: isOwner || isDailySettlement,
    initialAmount: isDailySettlement ? "" : "0",
  };
}
