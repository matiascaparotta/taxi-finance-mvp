import { formatDate } from "./formatDate";
import { formatCurrency } from "./formatCurrency";

export function buildWorkDaySummaryText(workDay, summary) {
  const workedKm = Number(workDay.endKm) - Number(workDay.startKm);

  return `🚖 Taxi Finance

📅 Fecha: ${formatDate(workDay.date)}

🚖 Viajes: ${summary.tripCount}
📍 Km inicial: ${workDay.startKm}
📍 Km final: ${workDay.endKm}
📍 Km trabajados: ${workedKm}

💶 Facturación: ${formatCurrency(summary.totalRevenue)}
💳 Datáfono: ${formatCurrency(summary.card)}
💵 Efectivo: ${formatCurrency(summary.cash)}
⛽ Combustible: ${formatCurrency(workDay.fuelOwn)}

Generado con Taxi Finance`;
}