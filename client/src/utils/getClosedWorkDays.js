export function getClosedWorkDays(workDays = []) {
  return workDays.filter((workDay) => workDay.status === "CLOSED");
}
