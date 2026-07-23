import { formatCurrency } from "./formatCurrency.js";
import { formatDate } from "./formatDate.js";

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

function drawText(
  context,
  text,
  x,
  y,
  font,
  color,
  align = "left"
) {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "top";
  context.fillText(text, x, y);
}

function formatTripTime(trip) {
  const rawDate = trip.createdAt || trip.created_at || trip.createdAtFormatted;

  if (!rawDate) {
    return "--:--";
  }

  return new Date(rawDate).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

export async function createWorkDayShareCard(
  workDay,
  summary,
  trips = []
) {
  const sortedTrips = [...trips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateA - dateB;
  });
  const tripHeights = sortedTrips.map((trip) =>
    Number(trip.commission || 0) > 0 || Number(trip.tip || 0) > 0
      ? 190
      : 145
  );
  const tripsHeight =
    tripHeights.reduce((total, height) => total + height, 0) +
    Math.max(sortedTrips.length - 1, 0) * 18;
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const summaryRows = [
    {
      label: "Viajes",
      value: `${summary.tripCount} (${summary.cashTripCount} E | ${summary.cardTripCount} D)`,
    },
    {
      label: "Efectivo",
      value: formatCurrency(summary.realCash ?? summary.cash),
    },
    { label: "Datáfono", value: formatCurrency(summary.card) },
    { label: "Facturación", value: formatCurrency(summary.totalRevenue) },
    ...(fuelOwn > 0
      ? [{ label: "Gasolina", value: formatCurrency(fuelOwn) }]
      : []),
    ...(fuelJose > 0
      ? [{ label: "Gasolina José", value: formatCurrency(fuelJose) }]
      : []),
  ];
  const journeyTop = 225;
  const tripsTitleTop = 455;
  const tripsTop = 505;
  const emptyTripsHeight = sortedTrips.length === 0 ? 115 : 0;
  const summaryTitleTop =
    tripsTop + (tripsHeight || emptyTripsHeight) + 65;
  const summaryTop = summaryTitleTop + 50;
  const summaryHeight = summaryRows.length * 76 + 28;
  const cardHeight = summaryTop + summaryHeight + 115;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = CARD_WIDTH;
  canvas.height = cardHeight;

  const background = context.createLinearGradient(0, 0, 0, cardHeight);
  background.addColorStop(0, "#07111f");
  background.addColorStop(1, COLORS.background);
  context.fillStyle = background;
  context.fillRect(0, 0, CARD_WIDTH, cardHeight);

  drawText(
    context,
    "TAXI FINANCE",
    CARD_WIDTH / 2,
    58,
    "700 32px Arial",
    COLORS.emerald,
    "center"
  );
  drawText(
    context,
    "JORNADA FINALIZADA",
    CARD_WIDTH / 2,
    112,
    "700 58px Arial",
    COLORS.text,
    "center"
  );

  drawText(
    context,
    "JORNADA",
    70,
    190,
    "700 27px Arial",
    COLORS.emerald
  );
  drawPanel(context, 70, journeyTop, 940, 175);
  drawText(
    context,
    formatDate(workDay.date),
    110,
    journeyTop + 38,
    "700 40px Arial",
    COLORS.text
  );
  drawText(
    context,
    `${workDay.startKm} km`,
    110,
    journeyTop + 112,
    "700 31px Arial",
    COLORS.text
  );
  drawText(
    context,
    "INICIAL",
    110,
    journeyTop + 88,
    "700 20px Arial",
    COLORS.muted
  );
  drawText(
    context,
    `${workDay.endKm} km`,
    425,
    journeyTop + 112,
    "700 31px Arial",
    COLORS.text
  );
  drawText(
    context,
    "FINAL",
    425,
    journeyTop + 88,
    "700 20px Arial",
    COLORS.muted
  );
  drawText(
    context,
    `${summary.workedKm} km`,
    735,
    journeyTop + 112,
    "700 31px Arial",
    COLORS.text
  );
  drawText(
    context,
    "TRABAJADOS",
    735,
    journeyTop + 88,
    "700 20px Arial",
    COLORS.muted
  );

  drawText(
    context,
    "VIAJES",
    70,
    tripsTitleTop,
    "700 27px Arial",
    COLORS.emerald
  );

  if (sortedTrips.length === 0) {
    drawPanel(context, 70, tripsTop, 940, emptyTripsHeight);
    drawText(
      context,
      "No se registraron viajes en esta jornada.",
      110,
      tripsTop + 38,
      "400 28px Arial",
      COLORS.muted
    );
  } else {
    let tripTop = tripsTop;

    sortedTrips.forEach((trip, index) => {
      const height = tripHeights[index];
      const hasCommission = Number(trip.commission || 0) > 0;
      const hasTip = Number(trip.tip || 0) > 0;

      drawPanel(context, 70, tripTop, 940, height);
      drawText(
        context,
        formatTripTime(trip),
        110,
        tripTop + 30,
        "700 32px Arial",
        COLORS.text
      );
      drawText(
        context,
        trip.paymentType === "cash" ? "Efectivo" : "Datáfono",
        110,
        tripTop + 78,
        "400 25px Arial",
        COLORS.muted
      );
      drawText(
        context,
        formatCurrency(trip.amount),
        970,
        tripTop + 43,
        "700 43px Arial",
        COLORS.text,
        "right"
      );

      if (hasCommission || hasTip) {
        const details = [
          ...(hasCommission
            ? [`Comisión: ${formatCurrency(trip.commission)}`]
            : []),
          ...(hasTip ? [`Propina: ${formatCurrency(trip.tip)}`] : []),
        ].join("   ·   ");

        drawText(
          context,
          details,
          110,
          tripTop + 137,
          "400 24px Arial",
          COLORS.muted
        );
      }

      tripTop += height + 18;
    });
  }

  drawText(
    context,
    "RESUMEN",
    70,
    summaryTitleTop,
    "700 27px Arial",
    COLORS.emerald
  );
  drawPanel(context, 70, summaryTop, 940, summaryHeight);

  summaryRows.forEach((row, index) => {
    const rowTop = summaryTop + 24 + index * 76;

    drawText(
      context,
      row.label,
      110,
      rowTop,
      "400 28px Arial",
      COLORS.muted
    );
    drawText(
      context,
      row.value,
      970,
      rowTop,
      row.label === "Facturación" ? "700 36px Arial" : "700 31px Arial",
      COLORS.text,
      "right"
    );

    if (index < summaryRows.length - 1) {
      context.beginPath();
      context.moveTo(110, rowTop + 55);
      context.lineTo(970, rowTop + 55);
      context.strokeStyle = COLORS.border;
      context.lineWidth = 2;
      context.stroke();
    }
  });

  drawText(
    context,
    "Resumen generado con Taxi Finance",
    CARD_WIDTH / 2,
    cardHeight - 62,
    "400 23px Arial",
    COLORS.muted,
    "center"
  );

  return await canvasToBlob(canvas);
}
