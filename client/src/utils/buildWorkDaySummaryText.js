import { formatCurrency } from "./formatCurrency";

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

  const dateOnly = String(rawDate).split("T")[0];
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
  const workedKm = Number(workDay.endKm) - Number(workDay.startKm);

  return `${formatWorkDayHeader(workDay)}

KILÓMETROS: ${workedKm}

EFECTIVO: ${formatCurrency(summary.cash)}
DATÁFONO: ${formatCurrency(summary.card)}
TOTAL: ${formatCurrency(summary.totalRevenue)}

GASOLINA: ${formatCurrency(workDay.fuelOwn)}`;
}