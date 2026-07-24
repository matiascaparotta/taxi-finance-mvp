import { getClosedWorkDays } from "./getClosedWorkDays.js";
import { sortWorkDaysByDateDescending } from "./sortWorkDaysByDate.js";

export function getRecentClosedWorkDays(workDays = [], limit = 5) {
  return sortWorkDaysByDateDescending(
    getClosedWorkDays(workDays)
  ).slice(0, limit);
}
