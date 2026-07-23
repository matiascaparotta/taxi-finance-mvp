import { formatCurrency } from "./formatCurrency";
import { formatDate } from "./formatDate";

const CARD_WIDTH = 1080;
const COLORS = {
  background: "#020617",
  panel: "#0f172a",
  border: "#1e293b",
  emerald: "#34d399",
  emeraldDark: "#064e3b",
  text: "#f8fafc",
  muted: "#94a3b8",
};

function drawRoundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawPanel(context, x, y, width, height, accent = false) {
  drawRoundedRect(context, x, y, width, height, 28);
  context.fillStyle = accent ? COLORS.emeraldDark : COLORS.panel;
  context.fill();
  context.lineWidth = accent ? 3 : 2;
  context.strokeStyle = accent ? COLORS.emerald : COLORS.border;
  context.stroke();
}

function drawCenteredText(context, text, centerX, y, font, color) {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillText(text, centerX, y);
}

function drawMetric(context, { label, value, x, y, width, height }) {
  drawPanel(context, x, y, width, height);
  drawCenteredText(
    context,
    label.toUpperCase(),
    x + width / 2,
    y + 40,
    "700 30px Arial",
    COLORS.muted
  );
  drawCenteredText(
    context,
    value,
    x + width / 2,
    y + 100,
    "700 54px Arial",
    COLORS.text
  );
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("No se pudo generar la tarjeta"));
    }, "image/png");
  });
}

export async function createWorkDayShareCard(workDay, summary) {
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const hasFuel = fuelOwn > 0 || fuelJose > 0;
  const cardHeight = hasFuel ? 1350 : 1120;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = CARD_WIDTH;
  canvas.height = cardHeight;

  const background = context.createLinearGradient(0, 0, 0, cardHeight);
  background.addColorStop(0, "#07111f");
  background.addColorStop(1, COLORS.background);
  context.fillStyle = background;
  context.fillRect(0, 0, CARD_WIDTH, cardHeight);

  drawCenteredText(
    context,
    "TAXI FINANCE",
    CARD_WIDTH / 2,
    68,
    "700 34px Arial",
    COLORS.emerald
  );
  drawCenteredText(
    context,
    "JORNADA FINALIZADA",
    CARD_WIDTH / 2,
    126,
    "700 62px Arial",
    COLORS.text
  );

  drawPanel(context, 70, 230, 940, 170);
  context.fillStyle = COLORS.text;
  context.font = "700 44px Arial";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(formatDate(workDay.date), 110, 285);
  context.fillStyle = COLORS.muted;
  context.font = "700 25px Arial";
  context.fillText("KILÓMETROS TRABAJADOS", 610, 270);
  context.fillStyle = COLORS.text;
  context.font = "700 48px Arial";
  context.fillText(`${summary.workedKm} km`, 610, 315);

  drawMetric(context, {
    label: "Efectivo",
    value: formatCurrency(summary.realCash ?? summary.cash),
    x: 70,
    y: 440,
    width: 450,
    height: 200,
  });
  drawMetric(context, {
    label: "Datáfono",
    value: formatCurrency(summary.card),
    x: 560,
    y: 440,
    width: 450,
    height: 200,
  });

  drawPanel(context, 70, 680, 940, 245, true);
  drawCenteredText(
    context,
    "FACTURACIÓN",
    CARD_WIDTH / 2,
    725,
    "700 34px Arial",
    COLORS.emerald
  );
  drawCenteredText(
    context,
    formatCurrency(summary.totalRevenue),
    CARD_WIDTH / 2,
    790,
    "700 78px Arial",
    COLORS.text
  );

  if (hasFuel) {
    drawMetric(context, {
      label: "Gasolina",
      value: formatCurrency(fuelOwn),
      x: 70,
      y: 970,
      width: fuelJose > 0 ? 450 : 940,
      height: 200,
    });

    if (fuelJose > 0) {
      drawMetric(context, {
        label: "Gasolina José",
        value: formatCurrency(fuelJose),
        x: 560,
        y: 970,
        width: 450,
        height: 200,
      });
    }
  }

  context.fillStyle = COLORS.muted;
  context.font = "400 23px Arial";
  context.textAlign = "center";
  context.textBaseline = "bottom";
  context.fillText(
    "Resumen generado con Taxi Finance",
    CARD_WIDTH / 2,
    cardHeight - 45
  );

  return await canvasToBlob(canvas);
}
