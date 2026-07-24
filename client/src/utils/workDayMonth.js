import { normalizeWorkDayDate } from "./workDayDate.js";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function getWorkDayMonthKey(workDay) {
  const rawDate =
    workDay?.date ??
    workDay?.workDate ??
    workDay?.createdAt ??
    workDay?.created_at;
  const normalizedDate = normalizeWorkDayDate(String(rawDate || ""));

  return normalizedDate ? normalizedDate.slice(0, 7) : "";
}

export function formatWorkDayMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month || month < 1 || month > 12) {
    return "Mes no disponible";
  }

  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function getAvailableWorkDayMonths(workDays = []) {
  return [
    ...new Set(
      workDays
        .map(getWorkDayMonthKey)
        .filter(Boolean)
    ),
  ].sort((a, b) => b.localeCompare(a));
}

export function filterWorkDaysByMonth(workDays = [], monthKey) {
  return workDays.filter(
    (workDay) => getWorkDayMonthKey(workDay) === monthKey
  );
}
