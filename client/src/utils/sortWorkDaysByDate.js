const getWorkDayTimestamp = (workDay) => {
  const rawDate =
    workDay.date ??
    workDay.workDate ??
    workDay.createdAt ??
    workDay.created_at;
  const timestamp = new Date(rawDate || 0).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export function sortWorkDaysByDateDescending(workDays = []) {
  return [...workDays].sort((a, b) => {
    const dateDifference =
      getWorkDayTimestamp(b) - getWorkDayTimestamp(a);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return Number(b.id || 0) - Number(a.id || 0);
  });
}
