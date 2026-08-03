import { DEFAULT_ORGANIZATION_NAME } from "../config/branding.js";
import { formatCurrency } from "./formatCurrency.js";

const WIDTH = 1080;
const COLORS = {
  background: "#020617",
  panel: "#0f172a",
  border: "#1e293b",
  emerald: "#34d399",
  emeraldDark: "#064e3b",
  sky: "#38bdf8",
  text: "#f8fafc",
  muted: "#94a3b8",
};

const monthName = (month) => {
  const [year, monthNumber] = month.split("-");
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${year}-${monthNumber}-01T00:00:00Z`));
};

const drawRoundedRect = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
};

const drawPanel = (context, x, y, width, height, accent = false) => {
  drawRoundedRect(context, x, y, width, height, 28);
  context.fillStyle = accent ? COLORS.emeraldDark : COLORS.panel;
  context.fill();
  context.lineWidth = accent ? 3 : 2;
  context.strokeStyle = accent ? COLORS.emerald : COLORS.border;
  context.stroke();
};

const drawText = (context, text, x, y, font, color, align = "left") => {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "top";
  context.fillText(text, x, y);
};

const canvasToBlob = (canvas) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo generar la tarjeta")), "image/png");
});

export async function createMonthlySettlementShareCard(settlement) {
  if (settlement?.status !== "CLOSED") {
    throw new Error("Solo se comparten liquidaciones cerradas");
  }

  const calculation = settlement.calculation;
  const rows = [
    ["Facturación total", calculation.rawRevenue],
    ["Efectivo", calculation.cashGenerated],
    ["Datáfono", calculation.cardGenerated],
    ["Gasolina de Matías", -calculation.fuelOwn],
    ["Gasolina de José", -calculation.fuelJose],
    ["Seguridad Social", -calculation.socialSecurityApplied],
    ["Base neta para repartir", calculation.distributableBase],
    ["Ganancia neta Matías", calculation.driverHalf],
    ["Ganancia neta José", calculation.ownerHalf],
    ["Nómina transferida", calculation.payrollTransfer],
    ["Pendiente para Matías", calculation.pendingForDriver],
    ["Efectivo disponible", calculation.cashAvailable],
  ];
  const height = 1660;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = height;

  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#07111f");
  background.addColorStop(1, COLORS.background);
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, height);

  drawText(context, DEFAULT_ORGANIZATION_NAME, WIDTH / 2, 55, "700 30px Arial", COLORS.emerald, "center");
  drawText(context, "LIQUIDACIÓN MENSUAL", WIDTH / 2, 104, "700 52px Arial", COLORS.text, "center");
  drawText(context, monthName(settlement.month).toUpperCase(), WIDTH / 2, 178, "700 29px Arial", COLORS.muted, "center");

  drawPanel(context, 70, 250, 940, 145, true);
  drawText(context, "FACTURACIÓN TOTAL", 110, 282, "700 23px Arial", COLORS.emerald);
  drawText(context, formatCurrency(calculation.rawRevenue), 110, 323, "700 47px Arial", COLORS.text);
  drawText(context, `${calculation.workedDays} jornadas · ${calculation.tripCount} viajes`, 970, 334, "700 23px Arial", COLORS.muted, "right");

  drawPanel(context, 70, 430, 940, 900);
  rows.forEach(([label, value], index) => {
    const top = 459 + index * 70;
    const highlighted = label.includes("Base neta") || label.includes("Ganancia neta");
    drawText(context, label, 110, top, highlighted ? "700 27px Arial" : "400 26px Arial", highlighted ? COLORS.text : COLORS.muted);
    drawText(context, formatCurrency(value), 970, top, "700 29px Arial", highlighted ? COLORS.emerald : COLORS.text, "right");
    if (index < rows.length - 1) {
      context.beginPath();
      context.moveTo(110, top + 48);
      context.lineTo(970, top + 48);
      context.strokeStyle = COLORS.border;
      context.lineWidth = 2;
      context.stroke();
    }
  });

  drawPanel(context, 70, 1370, 940, 170, true);
  const deliveryLabel = calculation.deliveryToOwner >= 0 ? "MATÍAS ENTREGA A JOSÉ" : "JOSÉ ENTREGA A MATÍAS";
  drawText(context, deliveryLabel, 110, 1405, "700 25px Arial", COLORS.emerald);
  drawText(context, formatCurrency(Math.abs(calculation.deliveryToOwner)), 110, 1450, "700 48px Arial", COLORS.text);
  drawText(context, "Liquidación cerrada", 970, 1465, "700 23px Arial", COLORS.sky, "right");

  drawText(context, "Generado con TaxFin", WIDTH / 2, 1595, "400 22px Arial", COLORS.muted, "center");
  return canvasToBlob(canvas);
}
