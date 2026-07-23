import { formatCurrency } from "./formatCurrency.js";
import { normalizeWorkDayDate } from "./workDayDate.js";

const WEEK_DAYS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

function formatWorkDayHeader(workDay) {
  const rawDate = workDay.date || workDay.workDate || workDay.createdAt || workDay.created_at;

  if (!rawDate) {
    return "FECHA NO DISPONIBLE";
  }

  const dateOnly = normalizeWorkDayDate(String(rawDate));
  const parsedDate = new Date(`${dateOnly}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "FECHA NO DISPONIBLE";
  }

  const weekDay = WEEK_DAYS[parsedDate.getDay()];
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  return `${weekDay} ${day}/${month}`;
}

export function buildWorkDaySummaryText(workDay, summary) {
  const workedKm = Number(
    summary.workedKm ??
      Number(workDay.endKm) - Number(workDay.startKm)
  );
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const lines = [
    formatWorkDayHeader(workDay),
    "",
    `KM: ${workedKm}`,
    "",
    `EFECTIVO: ${formatCurrency(summary.realCash ?? summary.cash)}`,
    `DATÁFONO: ${formatCurrency(summary.card)}`,
    `FACTURACIÓN: ${formatCurrency(summary.totalRevenue)}`,
  ];

  if (fuelOwn > 0 || fuelJose > 0) {
    lines.push("");
  }

  if (fuelOwn > 0) {
    lines.push(`GASOLINA: ${formatCurrency(fuelOwn)}`);
  }

  if (fuelJose > 0) {
    lines.push(`GASOLINA JOSÉ: ${formatCurrency(fuelJose)}`);
  }

  return lines.join("\n");
}
