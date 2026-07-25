export function getManagedOpenWorkDays(workDays = []) {
  return workDays.filter(
    (workDay) =>
      workDay.status === "OPEN" && workDay.canManage === false
  );
}
