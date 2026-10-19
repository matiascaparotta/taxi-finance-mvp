import { formatCurrency } from "./formatCurrency.js";
import { formatDate } from "./formatDate.js";
import { getDisplayedCash } from "./getDisplayedCash.js";
import { getWorkDayOrganizationName } from "../config/branding.js";
import { getDailySettlementShareData } from "./getDailySettlementShareData.js";

const CARD_WIDTH = 1080;
const TRIPS_PER_PAGE = 11;
const TRIPS_PAGE_HEIGHT = 1920;
const COLORS = {
  background: "#020617",
  panel: "#0f172a",
  border: "#1e293b",
  emerald: "#34d399",
  emeraldDark: "#064e3b",
  text: "#f8fafc",
  muted: "#94a3b8",
  sky: "#38bdf8",
  skyDark: "#0c4a6e",
  amber: "#fbbf24",
  amberDark: "#78350f",
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

function drawDataPanel(context, { title, rows, x, y, width, accent = COLORS.sky }) {
  const rowHeight = 52;
  const height = 68 + rows.length * rowHeight;
  drawPanel(context, x, y, width, height);
  drawText(context, title, x + 30, y + 22, "700 21px Arial", accent);
  rows.forEach((row, index) => {
    const rowTop = y + 68 + index * rowHeight;
    const emphasized = Boolean(row.emphasized);
    context.font = emphasized ? "700 20px Arial" : "400 19px Arial";
    let fittedLabel = row.label;
    while (context.measureText(fittedLabel).width > width - 170 && fittedLabel.length > 4) {
      fittedLabel = `${fittedLabel.slice(0, -2)}…`;
    }
    drawText(
      context,
      fittedLabel,
      x + 30,
      rowTop,
      emphasized ? "700 20px Arial" : "400 19px Arial",
      emphasized ? COLORS.text : COLORS.muted
    );
    drawText(
      context,
      formatCurrency(row.value),
      x + width - 30,
      rowTop,
      emphasized ? "700 23px Arial" : "700 20px Arial",
      COLORS.text,
      "right"
    );
  });
  return y + height;
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

function createCanvas(height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = CARD_WIDTH;
  canvas.height = height;

  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#07111f");
  background.addColorStop(1, COLORS.background);
  context.fillStyle = background;
  context.fillRect(0, 0, CARD_WIDTH, height);

  return { canvas, context };
}

function drawBrandHeader(context, title, organizationName) {
  drawText(
    context,
    organizationName,
    CARD_WIDTH / 2,
    58,
    "700 32px Arial",
    COLORS.emerald,
    "center"
  );
  drawText(
    context,
    title,
    CARD_WIDTH / 2,
    112,
    "700 58px Arial",
    COLORS.text,
    "center"
  );
}

function getSortedTrips(trips) {
  return [...trips].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);

    return dateA - dateB;
  });
}

export function paginateTrips(
  trips = [],
  pageSize = TRIPS_PER_PAGE
) {
  const pages = [];

  for (let index = 0; index < trips.length; index += pageSize) {
    pages.push(trips.slice(index, index + pageSize));
  }

  return pages;
}

async function createSummaryCard(workDay, summary) {
  const fuelOwn = Number(summary.fuelOwn ?? workDay.fuelOwn ?? 0);
  const fuelJose = Number(summary.fuelJose ?? workDay.fuelJose ?? 0);
  const dailySettlement = getDailySettlementShareData(
    summary.dailySettlement,
    summary
  );
  const summaryRows = [
    {
      label: "Viajes",
      value: `${summary.tripCount} (${summary.cashTripCount} E | ${summary.cardTripCount} D)`,
    },
    {
      label: "Efectivo",
      value: formatCurrency(getDisplayedCash(summary)),
    },
    { label: "Datáfono", value: formatCurrency(summary.card) },
    { label: "Facturación", value: formatCurrency(summary.totalRevenue) },
    ...(!dailySettlement && fuelOwn > 0
      ? [{ label: "Gasolina", value: formatCurrency(fuelOwn) }]
      : []),
    ...(!dailySettlement && fuelJose > 0
      ? [{ label: "Gasolina José", value: formatCurrency(fuelJose) }]
      : []),
  ];
  const settlement = summary.dailySettlement;
  const adjustmentRows = (settlement?.adjustments || [])
    .filter((adjustment) => Number(adjustment.workDayId) === Number(summary.workDayId))
    .map((adjustment) => ({
      label: `Ajuste · ${adjustment.reason}`,
      value: adjustment.direction === "OWNER_TO_DRIVER"
        ? Number(adjustment.amount)
        : -Number(adjustment.amount),
    }));
  const commissionRows = Number(summary.commission || 0) > 0
    ? [
        { label: "Total descontado", value: -Number(summary.commission), emphasized: true },
        ...(Number(summary.cashCommission || 0) > 0
          ? [{ label: "En efectivo", value: -Number(summary.cashCommission) }]
          : []),
        ...(Number(summary.cardCommission || 0) > 0
          ? [{ label: "En datáfono", value: -Number(summary.cardCommission) }]
          : []),
        ...(summary.commissionByCompany || []).map((company) => ({
          label: `${company.name} · ${company.tripCount}`,
          value: -Number(company.amount),
        })),
      ]
    : [{ label: "Sin comisiones", value: 0 }];
  const repartoRows = settlement ? [
    { label: "Facturación neta", value: settlement.netRevenue },
    { label: "Seguridad Social", value: -settlement.socialSecurity },
    { label: "Gasolina", value: -settlement.fuelCost },
    { label: "Base para repartir", value: settlement.distributableBase, emphasized: true },
    { label: `Tu parte · ${Number(settlement.driverSharePercentage || 0)} %`, value: settlement.driverShare },
    { label: "Parte del jefe", value: settlement.ownerShare },
    { label: "Reintegro gasolina", value: settlement.reimbursableFuel },
    { label: "Total que te corresponde", value: settlement.driverEntitlement, emphasized: true },
  ] : [];
  const cashRows = settlement ? [
    { label: "Efectivo conservado", value: settlement.cashRetained },
    ...(Number(settlement.ownerAdjustment || 0) > 0
      ? [{ label: "Externo para el jefe", value: -settlement.ownerAdjustment }]
      : []),
    { label: "Resultado del día", value: settlement.originalBalance ?? settlement.balance, emphasized: true },
  ] : [];
  const balanceRows = settlement && Number.isFinite(Number(settlement.previousPendingBalance))
    ? [
        { label: "Pendiente anterior", value: settlement.previousPendingBalance },
        { label: "Resultado del día", value: settlement.originalBalance },
        ...(Number(settlement.currentDayPaymentEffect || 0) !== 0
          ? [{ label: "Pagos del día", value: settlement.currentDayPaymentEffect }]
          : []),
        ...adjustmentRows,
        { label: "Pendiente final", value: settlement.pendingBalance, emphasized: true },
      ]
    : adjustmentRows;
  const journeyTop = 225;
  const summaryTitleTop = 455;
  const summaryTop = summaryTitleTop + 50;
  const summaryHeight = summaryRows.length * 76 + 28;
  const settlementTitleTop = summaryTop + summaryHeight + 55;
  const settlementTop = settlementTitleTop + 48;
  const leftColumnHeight = 68 + commissionRows.length * 52 + 24 + 68 + repartoRows.length * 52;
  const rightColumnHeight = 68 + cashRows.length * 52 + 24 + 68 + balanceRows.length * 52;
  const resultTop = settlementTop + Math.max(leftColumnHeight, rightColumnHeight) + 28;
  const resultHeight = 300;
  const cardHeight = dailySettlement
    ? resultTop + resultHeight + 60
    : summaryTop + summaryHeight + 60;
  const { canvas, context } = createCanvas(cardHeight);

  drawBrandHeader(
    context,
    "JORNADA FINALIZADA",
    getWorkDayOrganizationName(workDay)
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

  if (dailySettlement) {
    drawText(
      context,
      "LIQUIDACIÓN DEL DÍA",
      70,
      settlementTitleTop,
      "700 27px Arial",
      COLORS.sky
    );
    const leftAfterCommissions = drawDataPanel(context, {
      title: "1 · COMISIONES",
      rows: commissionRows,
      x: 70,
      y: settlementTop,
      width: 455,
      accent: COLORS.amber,
    });
    drawDataPanel(context, {
      title: "2 · CÁLCULO DEL REPARTO",
      rows: repartoRows,
      x: 70,
      y: leftAfterCommissions + 24,
      width: 455,
    });
    const rightAfterCash = drawDataPanel(context, {
      title: "3 · CIERRE DE CAJA",
      rows: cashRows,
      x: 555,
      y: settlementTop,
      width: 455,
      accent: COLORS.emerald,
    });
    drawDataPanel(context, {
      title: "4 · SALDO ACUMULADO",
      rows: balanceRows,
      x: 555,
      y: rightAfterCash + 24,
      width: 455,
      accent: COLORS.sky,
    });

    const isOwnerPayment =
      summary.dailySettlement.balanceDirection === "OWNER_PAYS_DRIVER";
    const isDriverPayment =
      summary.dailySettlement.balanceDirection === "DRIVER_PAYS_OWNER";
    drawRoundedRect(context, 70, resultTop, 940, resultHeight, 28);
    context.fillStyle = isOwnerPayment
      ? COLORS.skyDark
      : isDriverPayment
        ? COLORS.amberDark
        : COLORS.panel;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = isOwnerPayment
      ? COLORS.sky
      : isDriverPayment
        ? COLORS.amber
        : COLORS.border;
    context.stroke();

    drawText(
      context,
      dailySettlement.result.eyebrow,
      110,
      resultTop + 28,
      "700 22px Arial",
      isOwnerPayment
        ? COLORS.sky
        : isDriverPayment
          ? COLORS.amber
          : COLORS.muted
    );
    drawText(
      context,
      dailySettlement.result.title,
      110,
      resultTop + 78,
      "700 33px Arial",
      COLORS.text
    );
    drawText(
      context,
      formatCurrency(dailySettlement.result.amount),
      970,
      resultTop + 72,
      "700 46px Arial",
      COLORS.text,
      "right"
    );

    context.beginPath();
    context.moveTo(110, resultTop + 158);
    context.lineTo(970, resultTop + 158);
    context.strokeStyle = isOwnerPayment
      ? COLORS.sky
      : isDriverPayment
        ? COLORS.amber
        : COLORS.border;
    context.globalAlpha = 0.35;
    context.lineWidth = 2;
    context.stroke();
    context.globalAlpha = 1;

    drawText(
      context,
      "SALDO AL FINALIZAR ESTA JORNADA",
      110,
      resultTop + 188,
      "700 22px Arial",
      COLORS.muted
    );
    drawText(
      context,
      dailySettlement.pending.label,
      110,
      resultTop + 231,
      "700 28px Arial",
      COLORS.text
    );
    drawText(
      context,
      formatCurrency(dailySettlement.pending.amount),
      970,
      resultTop + 222,
      "700 40px Arial",
      COLORS.text,
      "right"
    );
  }

  return await canvasToBlob(canvas);
}

async function createTripsCard(
  workDay,
  trips,
  pageIndex,
  totalPages,
  allTrips,
  summary
) {
  const { canvas, context } = createCanvas(TRIPS_PAGE_HEIGHT);

  drawBrandHeader(
    context,
    "DETALLE DE VIAJES",
    getWorkDayOrganizationName(workDay)
  );
  drawText(
    context,
    formatDate(workDay.date),
    70,
    205,
    "700 34px Arial",
    COLORS.text
  );
  drawText(
    context,
    `Página ${pageIndex + 1} de ${totalPages}`,
    1010,
    211,
    "700 26px Arial",
    COLORS.muted,
    "right"
  );

  let tripTop = 275;

  trips.forEach((trip) => {
    const hasAdjustments = Number(trip.commission || 0) > 0 || Number(trip.tip || 0) > 0;
    drawPanel(context, 70, tripTop, 940, 92);
    drawText(
      context,
      formatTripTime(trip),
      110,
      tripTop + 17,
      "700 26px Arial",
      COLORS.text
    );
    drawText(
      context,
      trip.paymentType === "cash" ? "Efectivo" : "Datáfono",
      245,
      tripTop + 21,
      "400 22px Arial",
      COLORS.muted
    );
    drawText(
      context,
      formatCurrency(trip.amount),
      970,
      tripTop + 17,
      "700 32px Arial",
      COLORS.text,
      "right"
    );

    if (hasAdjustments) {
      const adjustments = [
        Number(trip.commission || 0) > 0
          ? `Comisión${trip.commissionCompanyName ? ` · ${trip.commissionCompanyName}` : ""} −${formatCurrency(trip.commission)}`
          : null,
        Number(trip.tip || 0) > 0
          ? `Propina +${formatCurrency(trip.tip)}`
          : null,
      ].filter(Boolean).join("   ·   ");
      drawText(context, adjustments, 245, tripTop + 61, "400 19px Arial", COLORS.sky);
    }

    tripTop += 102;
  });

  if (pageIndex === totalPages - 1) {
    const cashTrips = allTrips.filter((trip) => trip.paymentType === "cash");
    const cardTrips = allTrips.filter((trip) => trip.paymentType !== "cash");
    const totalCommission = allTrips.reduce((total, trip) => total + Number(trip.commission || 0), 0);
    const totalTip = allTrips.reduce((total, trip) => total + Number(trip.tip || 0), 0);
    const totalsTop = Math.max(tripTop + 28, 1450);
    drawText(context, "CONTROL FINAL", 70, totalsTop, "700 27px Arial", COLORS.emerald);
    drawPanel(context, 70, totalsTop + 48, 940, 330, true);
    const rows = [
      [`Efectivo · ${cashTrips.length} viajes`, summary.cash],
      [`Datáfono · ${cardTrips.length} viajes`, summary.card],
      ["Comisiones", totalCommission],
      ["Propinas", totalTip],
      ["FACTURACIÓN COMPROBADA", summary.totalRevenue],
    ];
    rows.forEach(([label, value], index) => {
      const rowTop = totalsTop + 72 + index * 52;
      drawText(context, label, 110, rowTop, index === 4 ? "700 25px Arial" : "400 23px Arial", index === 4 ? COLORS.text : COLORS.muted);
      drawText(context, formatCurrency(value), 970, rowTop, index === 4 ? "700 30px Arial" : "700 25px Arial", COLORS.text, "right");
    });
  }

  return await canvasToBlob(canvas);
}

export async function createWorkDayShareCards(
  workDay,
  summary,
  trips = []
) {
  const sortedTrips = getSortedTrips(
    trips.map(sanitizeTripForSharing)
  );
  const tripPages = paginateTrips(sortedTrips);
  const summaryCard = await createSummaryCard(workDay, summary);
  const detailCards = await Promise.all(
    tripPages.map((pageTrips, pageIndex) =>
      createTripsCard(
        workDay,
        pageTrips,
        pageIndex,
        tripPages.length,
        sortedTrips,
        summary
      )
    )
  );

  return [summaryCard, ...detailCards];
}

export function sanitizeTripForSharing(trip = {}) {
  return {
    id: trip.id,
    amount: trip.amount,
    paymentType: trip.paymentType,
    commission: trip.commission,
    commissionCompanyName: trip.commissionCompanyName,
    tip: trip.tip,
    createdAt: trip.createdAt,
    created_at: trip.created_at,
  };
}

export async function createWorkDayShareCard(
  workDay,
  summary,
  trips = []
) {
  const [summaryCard] = await createWorkDayShareCards(
    workDay,
    summary,
    trips
  );

  return summaryCard;
}
